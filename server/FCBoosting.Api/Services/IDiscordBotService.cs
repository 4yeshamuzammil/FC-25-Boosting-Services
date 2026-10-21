namespace FCBoosting.Api.Services;

public interface IDiscordBotService
{
    Task StartAsync(CancellationToken cancellationToken);
    Task StopAsync(CancellationToken cancellationToken);
    Task<bool> SendOrderStatusUpdateNotificationAsync(string orderNumber, string newStatus, string? note);
}
