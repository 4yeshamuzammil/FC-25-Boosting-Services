using Discord;
using Discord.WebSocket;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Services;

public class DiscordBotService : IDiscordBotService, IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _config;
    private readonly ILogger<DiscordBotService> _logger;
    private DiscordSocketClient? _client;

    public DiscordBotService(
        IServiceProvider serviceProvider,
        IConfiguration config,
        ILogger<DiscordBotService> logger)
    {
        _serviceProvider = serviceProvider;
        _config = config;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var token = _config["Discord:BotToken"];
        if (string.IsNullOrWhiteSpace(token) || token == "YOUR_DISCORD_BOT_TOKEN")
        {
            _logger.LogWarning("Discord:BotToken is not configured or placeholder. Discord bot worker will stand by.");
            return;
        }

        try
        {
            _client = new DiscordSocketClient(new DiscordSocketConfig
            {
                GatewayIntents = GatewayIntents.Guilds | GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
                AlwaysDownloadUsers = false,
                LogLevel = LogSeverity.Info,
            });

            _client.Log += LogAsync;
            _client.Ready += OnReadyAsync;
            _client.SlashCommandExecuted += HandleSlashCommandAsync;
            _client.ButtonExecuted += HandleButtonExecutedAsync;
            _client.ModalSubmitted += HandleModalSubmittedAsync;

            await _client.LoginAsync(TokenType.Bot, token);
            await _client.StartAsync();
            _logger.LogInformation("Discord Bot client connected and listening.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to start Discord Bot client.");
        }
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_client != null)
        {
            await _client.StopAsync();
            await _client.LogoutAsync();
            _client.Dispose();
        }
    }

    private Task LogAsync(LogMessage log)
    {
        _logger.LogInformation("[Discord.Net] {Source}: {Message}", log.Source, log.Message);
        return Task.CompletedTask;
    }

    private async Task OnReadyAsync()
    {
        _logger.LogInformation("Discord bot ready. Registering global slash commands...");
        if (_client == null) return;

        try
        {
            var orderCommand = new SlashCommandBuilder()
                .WithName("order")
                .WithDescription("Initiate or track an EA Sports FC boost order")
                .AddOption("reference", ApplicationCommandOptionType.String, "Your website order reference code (e.g. FC-ORD-12345)", isRequired: false);

            var statusCommand = new SlashCommandBuilder()
                .WithName("status")
                .WithDescription("Check real-time live status for your FC order")
                .AddOption("order_number", ApplicationCommandOptionType.String, "Order number (e.g. FC-ORD-94821)", isRequired: true);

            await _client.CreateGlobalApplicationCommandAsync(orderCommand.Build());
            await _client.CreateGlobalApplicationCommandAsync(statusCommand.Build());
            _logger.LogInformation("Global slash commands registered successfully.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to register Discord slash commands.");
        }
    }

    private async Task HandleSlashCommandAsync(SocketSlashCommand command)
    {
        await command.DeferAsync(ephemeral: true);

        using var scope = _serviceProvider.CreateScope();
        var lifecycle = scope.ServiceProvider.GetRequiredService<IOrderLifecycleService>();

        if (command.Data.Name == "status")
        {
            var orderNum = command.Data.Options.FirstOrDefault(o => o.Name == "order_number")?.Value?.ToString() ?? "";
            var order = await lifecycle.GetOrderByNumberOrReferenceAsync(orderNum);

            if (order == null)
            {
                await command.FollowupAsync($"❌ No order found matching reference `{orderNum}`. Please double check your order number.", ephemeral: true);
                return;
            }

            var embed = new EmbedBuilder()
                .WithTitle($"Order Status: #{order.OrderNumber}")
                .WithColor(order.Status switch
                {
                    "Completed" => Color.Green,
                    "InProgress" => Color.Gold,
                    "AwaitingCustomer" => Color.Red,
                    _ => Color.Blue
                })
                .AddField("Service", order.ServiceName, inline: true)
                .AddField("Platform", order.Platform, inline: true)
                .AddField("Status", order.Status, inline: true)
                .AddField("Price", $"${order.PriceSnapshot:F2} USD", inline: true)
                .AddField("Created", order.CreatedAt.ToString("g"), inline: true)
                .WithFooter("FC BOOST PRO • 100% Ban-Free Guarantee")
                .WithCurrentTimestamp()
                .Build();

            await command.FollowupAsync(embed: embed, ephemeral: true);
        }
        else if (command.Data.Name == "order")
        {
            var refCode = command.Data.Options.FirstOrDefault(o => o.Name == "reference")?.Value?.ToString();

            if (string.IsNullOrWhiteSpace(refCode))
            {
                var generalEmbed = new EmbedBuilder()
                    .WithTitle("🎮 Welcome to FC BOOST PRO Discord Ordering")
                    .WithDescription("To start a boost, configure your service on our website and click **Order Now (WhatsApp / Discord)** to receive a unique reference.")
                    .AddField("Official Website", "[Visit FC BOOST PRO](https://localhost:5173)", inline: false)
                    .WithColor(Color.Green)
                    .Build();

                await command.FollowupAsync(embed: generalEmbed, ephemeral: true);
                return;
            }

            var order = await lifecycle.GetOrderByNumberOrReferenceAsync(refCode);

            if (order != null)
            {
                var buttons = new ComponentBuilder()
                    .WithButton("Confirm & Connect with Booster", $"confirm_order_{order.OrderNumber}", ButtonStyle.Success)
                    .WithButton("Need Assistance", $"help_order_{order.OrderNumber}", ButtonStyle.Secondary);

                var embed = new EmbedBuilder()
                    .WithTitle($"Found Order #{order.OrderNumber}")
                    .WithColor(Color.Green)
                    .AddField("Service", order.ServiceName, inline: true)
                    .AddField("Price", $"${order.PriceSnapshot:F2} USD", inline: true)
                    .AddField("Current Status", order.Status, inline: true)
                    .WithDescription("Click below to confirm your account platform and receive instant 1-on-1 private booster ticket.")
                    .Build();

                await command.FollowupAsync(embed: embed, components: buttons.Build(), ephemeral: true);
            }
            else
            {
                await command.FollowupAsync($"⚠️ Reference code `{refCode}` not found in active sessions. You can create a new order directly on the site.", ephemeral: true);
            }
        }
    }

    private async Task HandleButtonExecutedAsync(SocketMessageComponent component)
    {
        var customId = component.Data.CustomId;

        if (customId.StartsWith("confirm_order_"))
        {
            var orderRef = customId.Replace("confirm_order_", "");

            var mb = new ModalBuilder()
                .WithTitle($"Order Details #{orderRef}")
                .WithCustomId($"modal_order_{orderRef}")
                .AddTextInput("GamerTag / PSN / Xbox ID", "gamertag", TextInputStyle.Short, "e.g. ProStriker_99", required: true)
                .AddTextInput("Preferred Platform", "platform", TextInputStyle.Short, "PS5 / Xbox / PC", required: true)
                .AddTextInput("Discord Stream Request", "stream", TextInputStyle.Short, "Yes or No", required: false);

            await component.RespondWithModalAsync(mb.Build());
        }
        else if (customId.StartsWith("help_order_"))
        {
            await component.RespondAsync("A manager has been notified. You can also contact our 24/7 WhatsApp desk.", ephemeral: true);
        }
    }

    private async Task HandleModalSubmittedAsync(SocketModal modal)
    {
        await modal.DeferAsync(ephemeral: true);

        if (modal.Data.CustomId.StartsWith("modal_order_"))
        {
            var orderRef = modal.Data.CustomId.Replace("modal_order_", "");
            var gamerTag = modal.Data.Components.FirstOrDefault(c => c.CustomId == "gamertag")?.Value ?? "Provided";
            var platform = modal.Data.Components.FirstOrDefault(c => c.CustomId == "platform")?.Value ?? "PS5";

            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();

            var order = await db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderRef);
            if (order != null)
            {
                order.GamerTag = gamerTag;
                order.Platform = platform;
                order.DiscordUserId = modal.User.Id.ToString();
                order.UpdatedAt = DateTime.UtcNow;

                order.OrderDetails.Add(new OrderDetail
                {
                    OrderId = order.OrderId,
                    FieldName = "Discord Confirmation",
                    FieldValue = $"Confirmed by {modal.User.Username} (ID: {modal.User.Id})",
                });

                await db.SaveChangesAsync();

                await modal.FollowupAsync($"✅ Order `#{orderRef}` successfully updated and queued! A pro booster is joining your private ticket channel shortly.", ephemeral: true);
            }
            else
            {
                await modal.FollowupAsync($"⚠️ Order reference `#{orderRef}` was not found.", ephemeral: true);
            }
        }
    }

    public async Task<bool> SendOrderStatusUpdateNotificationAsync(string orderNumber, string newStatus, string? note)
    {
        if (_client == null || _client.ConnectionState != ConnectionState.Connected)
        {
            _logger.LogWarning("Discord client not connected. Notification for order {OrderNumber} bypassed.", orderNumber);
            return false;
        }

        try
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();

            var order = await db.Orders.FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);
            if (order?.DiscordUserId != null && ulong.TryParse(order.DiscordUserId, out var discordUserId))
            {
                var user = await _client.GetUserAsync(discordUserId);
                if (user != null)
                {
                    var embed = new EmbedBuilder()
                        .WithTitle($"Order Update: #{order.OrderNumber}")
                        .WithDescription($"Your order status has changed to **{newStatus}**.")
                        .AddField("Note", note ?? "Status updated by admin/booster desk.", inline: false)
                        .WithColor(newStatus == "Completed" ? Color.Green : Color.Blue)
                        .WithCurrentTimestamp()
                        .Build();

                    await user.SendMessageAsync(embed: embed);
                    return true;
                }
            }
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send Discord direct message notification for order #{OrderNumber}.", orderNumber);
            return false;
        }
    }
}
