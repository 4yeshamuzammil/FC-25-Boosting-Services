using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;
using FCBoosting.Api.Services;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly IOrderLifecycleService _lifecycle;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        FCBoostingDbContext db,
        IOrderLifecycleService lifecycle,
        ILogger<OrdersController> logger)
    {
        _db = db;
        _lifecycle = lifecycle;
        _logger = logger;
    }

    public record CreateSessionRequest(
        string ServiceId,
        string ServiceName,
        decimal Price,
        string Platform,
        string TargetChannel);

    [HttpPost("session")]
    public async Task<IActionResult> CreateOrderSession([FromBody] CreateSessionRequest request)
    {
        if (request.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var orderRef = $"FC-ORD-{Random.Shared.Next(10000, 99999)}";
        var session = new OrderSessionToken
        {
            OrderReference = orderRef,
            ServiceId = request.ServiceId,
            ServiceName = request.ServiceName,
            PriceSnapshot = request.Price,
            Platform = request.Platform,
            TargetChannel = request.TargetChannel,
            ExpiresAt = DateTime.UtcNow.AddHours(2),
            IsUsed = false,
        };

        await _db.OrderSessionTokens.AddAsync(session);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            sessionToken = session.Token,
            orderReference = orderRef,
            serviceName = request.ServiceName,
            price = request.Price,
            platform = request.Platform,
            expiresAt = session.ExpiresAt
        });
    }

    public record CreateWhatsAppOrderDto(
        string OrderReference,
        string ServiceId,
        string ServiceName,
        decimal Price,
        string Platform,
        string? CustomerName,
        string? CustomerEmail);

    [HttpPost("whatsapp")]
    public async Task<IActionResult> CreateWhatsAppOrder([FromBody] CreateWhatsAppOrderDto dto)
    {
        if (dto.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var order = await _lifecycle.CreateOrderAsync(
            serviceId: dto.ServiceId,
            serviceName: dto.ServiceName,
            price: dto.Price,
            platform: dto.Platform,
            contactMethod: "WhatsApp",
            customerName: dto.CustomerName ?? "WhatsApp Customer",
            customerEmail: dto.CustomerEmail ?? "pending_whatsapp@customer.com",
            customOrderRef: dto.OrderReference);

        return Ok(new
        {
            orderId = order.OrderId,
            orderNumber = order.OrderNumber,
            status = order.Status,
            whatsappReference = order.WhatsAppReference,
            createdAt = order.CreatedAt
        });
    }

    public record CreateDiscordOrderDto(
        string OrderReference,
        string ServiceId,
        string ServiceName,
        decimal Price,
        string Platform,
        string? GamerTag,
        string? DiscordUserId);

    [HttpPost("discord")]
    public async Task<IActionResult> CreateDiscordOrder([FromBody] CreateDiscordOrderDto dto)
    {
        if (dto.Price <= 0)
        {
            return BadRequest("Price must be greater than zero.");
        }

        var order = await _lifecycle.CreateOrderAsync(
            serviceId: dto.ServiceId,
            serviceName: dto.ServiceName,
            price: dto.Price,
            platform: dto.Platform,
            contactMethod: "Discord",
            gamerTag: dto.GamerTag ?? "Pending Discord Ticket",
            customOrderRef: dto.OrderReference);

        if (!string.IsNullOrEmpty(dto.DiscordUserId))
        {
            order.DiscordUserId = dto.DiscordUserId;
            await _db.SaveChangesAsync();
        }

        return Ok(new
        {
            orderId = order.OrderId,
            orderNumber = order.OrderNumber,
            status = order.Status,
            discordUserId = order.DiscordUserId,
            createdAt = order.CreatedAt
        });
    }

    [HttpGet("track/{reference}")]
    public async Task<IActionResult> TrackOrder(string reference)
    {
        if (string.IsNullOrWhiteSpace(reference))
        {
            return BadRequest("Reference is required.");
        }

        var order = await _lifecycle.GetOrderByNumberOrReferenceAsync(reference.Trim());
        if (order == null)
        {
            return NotFound(new { message = $"No order found for reference '{reference}'." });
        }

        // Return sanitized public tracking info (zero credentials or private hashes)
        return Ok(new
        {
            orderNumber = order.OrderNumber,
            serviceName = order.ServiceName,
            platform = order.Platform,
            status = order.Status,
            price = order.PriceSnapshot,
            contactMethod = order.ContactMethod,
            createdAt = order.CreatedAt,
            completedAt = order.CompletedAt,
            hasProof = order.Attachments.Any(),
            statusHistory = order.StatusHistory.Select(h => new
            {
                status = h.NewStatus,
                date = h.ChangedAt,
                note = h.Notes
            }).OrderByDescending(h => h.date).ToList()
        });
    }
}
