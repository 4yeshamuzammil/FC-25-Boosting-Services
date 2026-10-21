using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;
using FCBoosting.Api.Services;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly IOrderLifecycleService _lifecycle;
    private readonly IStorageService _storage;
    private readonly IDiscordBotService _discordBot;
    private readonly ILogger<AdminController> _logger;

    public AdminController(
        FCBoostingDbContext db,
        IOrderLifecycleService lifecycle,
        IStorageService storage,
        IDiscordBotService discordBot,
        ILogger<AdminController> logger)
    {
        _db = db;
        _lifecycle = lifecycle;
        _storage = storage;
        _discordBot = discordBot;
        _logger = logger;
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders(
        [FromQuery] string? status = null,
        [FromQuery] string? contactMethod = null,
        [FromQuery] string? search = null)
    {
        var query = _db.Orders
            .Include(o => o.OrderDetails)
            .Include(o => o.Attachments)
            .Include(o => o.StatusHistory)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
        {
            query = query.Where(o => o.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(contactMethod) && contactMethod != "All")
        {
            query = query.Where(o => o.ContactMethod == contactMethod);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            query = query.Where(o =>
                o.OrderNumber.Contains(s) ||
                (o.CustomerName != null && o.CustomerName.Contains(s)) ||
                o.ServiceName.Contains(s));
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(o => new
        {
            id = o.OrderId,
            orderNumber = o.OrderNumber,
            serviceName = o.ServiceName,
            status = o.Status,
            price = o.PriceSnapshot,
            platform = o.Platform,
            contactMethod = o.ContactMethod,
            customerName = o.CustomerName,
            customerEmail = o.CustomerEmail,
            gamerTag = o.GamerTag,
            discordUserId = o.DiscordUserId,
            whatsAppReference = o.WhatsAppReference,
            createdAt = o.CreatedAt,
            updatedAt = o.UpdatedAt,
            completedAt = o.CompletedAt,
            attachmentsCount = o.Attachments.Count,
            history = o.StatusHistory.OrderByDescending(h => h.ChangedAt).Select(h => new
            {
                previousStatus = h.PreviousStatus,
                newStatus = h.NewStatus,
                changedBy = h.ChangedByUserId,
                date = h.ChangedAt,
                notes = h.Notes
            }).ToList()
        }));
    }

    public record UpdateStatusRequest(string NewStatus, string? Notes);

    [HttpPost("orders/{orderId}/status")]
    public async Task<IActionResult> UpdateOrderStatus(string orderId, [FromBody] UpdateStatusRequest request)
    {
        var adminUserId = User.Identity?.Name ?? "AdminOperator";

        var (success, message, order) = await _lifecycle.TransitionStatusAsync(
            orderId: orderId,
            newStatus: request.NewStatus,
            changedByUserId: adminUserId,
            notes: request.Notes);

        if (!success)
        {
            return BadRequest(new { message });
        }

        // Notify customer via Discord if applicable
        if (order != null && !string.IsNullOrEmpty(order.DiscordUserId))
        {
            _ = Task.Run(() => _discordBot.SendOrderStatusUpdateNotificationAsync(order.OrderNumber, request.NewStatus, request.Notes));
        }

        return Ok(new
        {
            message,
            orderNumber = order?.OrderNumber,
            newStatus = order?.Status,
            updatedAt = order?.UpdatedAt
        });
    }

    [HttpPost("orders/{orderId}/proof")]
    [RequestSizeLimit(10 * 1024 * 1024)] // 10 MB max
    public async Task<IActionResult> UploadProofAttachment(string orderId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded or file is empty.");
        }

        var adminUserId = User.Identity?.Name ?? "AdminOperator";

        await using var stream = file.OpenReadStream();
        var (success, message, attachment) = await _storage.SaveProofAttachmentAsync(
            orderId: orderId,
            fileName: file.FileName,
            contentType: file.ContentType,
            fileSize: file.Length,
            fileStream: stream,
            uploaderUserId: adminUserId);

        if (!success)
        {
            return BadRequest(new { message });
        }

        return Ok(new
        {
            message,
            attachmentId = attachment?.AttachmentId,
            fileName = attachment?.FileName,
            uploadedAt = attachment?.UploadedAt
        });
    }

    [HttpGet("orders/{orderId}/proof/{attachmentId}")]
    public async Task<IActionResult> GetProofAttachment(string orderId, string attachmentId)
    {
        var (stream, contentType, fileName) = await _storage.GetAttachmentStreamAsync(attachmentId);
        if (stream == null)
        {
            return NotFound("Proof attachment not found on secure disk storage.");
        }

        return File(stream, contentType, fileName);
    }
}
