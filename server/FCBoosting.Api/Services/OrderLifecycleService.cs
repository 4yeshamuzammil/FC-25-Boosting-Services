using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Services;

public class OrderLifecycleService : IOrderLifecycleService
{
    private readonly FCBoostingDbContext _db;
    private readonly ILogger<OrderLifecycleService> _logger;

    // Allowed status transitions map to enforce business rules
    private static readonly Dictionary<string, HashSet<string>> AllowedTransitions = new()
    {
        ["Pending"] = new() { "Accepted", "Cancelled" },
        ["Accepted"] = new() { "InProgress", "Cancelled" },
        ["InProgress"] = new() { "AwaitingCustomer", "Completed", "Cancelled" },
        ["AwaitingCustomer"] = new() { "InProgress", "Cancelled" },
        ["Completed"] = new() { }, // Terminal state
        ["Cancelled"] = new() { }  // Terminal state
    };

    public OrderLifecycleService(FCBoostingDbContext db, ILogger<OrderLifecycleService> logger)
    {
        _db = db;
        _logger = logger;
    }

    public async Task<Order> CreateOrderAsync(
        string serviceId,
        string serviceName,
        decimal price,
        string platform,
        string contactMethod,
        string? userId = null,
        string? customerName = null,
        string? customerEmail = null,
        string? gamerTag = null,
        string? customOrderRef = null,
        Dictionary<string, string>? requirements = null)
    {
        var orderNumber = customOrderRef ?? $"FC-ORD-{Random.Shared.Next(10000, 99999)}";

        // Check for idempotency: if order with this reference already exists, return it
        var existing = await _db.Orders
            .Include(o => o.OrderDetails)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

        if (existing != null)
        {
            _logger.LogInformation("Order #{OrderNumber} already exists. Returning existing instance (idempotent).", orderNumber);
            return existing;
        }

        var order = new Order
        {
            OrderNumber = orderNumber,
            ServiceId = serviceId,
            ServiceName = serviceName,
            PriceSnapshot = price,
            Platform = platform,
            ContactMethod = contactMethod,
            Status = "Pending",
            UserId = userId,
            CustomerName = customerName ?? "Valued Customer",
            CustomerEmail = customerEmail ?? "customer@order.com",
            GamerTag = gamerTag ?? "Pending via " + contactMethod,
            WhatsAppReference = contactMethod == "WhatsApp" ? orderNumber : null,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        if (requirements != null)
        {
            foreach (var (k, v) in requirements)
            {
                order.OrderDetails.Add(new OrderDetail
                {
                    FieldName = k,
                    FieldValue = v,
                });
            }
        }

        order.StatusHistory.Add(new OrderStatusHistory
        {
            PreviousStatus = "None",
            NewStatus = "Pending",
            ChangedByUserId = userId ?? "System/Customer",
            ChangedAt = DateTime.UtcNow,
            Notes = $"Order created via {contactMethod}.",
        });

        await _db.Orders.AddAsync(order);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Successfully created Order #{OrderNumber} with status Pending via {ContactMethod}.", orderNumber, contactMethod);
        return order;
    }

    public async Task<(bool Success, string Message, Order? Order)> TransitionStatusAsync(
        string orderId,
        string newStatus,
        string? changedByUserId,
        string? notes)
    {
        var order = await _db.Orders
            .Include(o => o.StatusHistory)
            .Include(o => o.Attachments)
            .FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);

        if (order == null)
        {
            return (false, "Order not found.", null);
        }

        if (order.Status == newStatus)
        {
            return (true, "Order is already in the requested status.", order);
        }

        // Validate transition
        if (!AllowedTransitions.TryGetValue(order.Status, out var allowed) || !allowed.Contains(newStatus))
        {
            return (false, $"Invalid status transition from '{order.Status}' to '{newStatus}'.", order);
        }

        // Special rule: Completing an order requires at least one proof attachment
        if (newStatus == "Completed" && !order.Attachments.Any())
        {
            return (false, "Cannot mark order as Completed without at least one proof screenshot or attachment uploaded.", order);
        }

        var previousStatus = order.Status;
        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        if (newStatus == "Completed")
        {
            order.CompletedAt = DateTime.UtcNow;
        }

        order.StatusHistory.Add(new OrderStatusHistory
        {
            PreviousStatus = previousStatus,
            NewStatus = newStatus,
            ChangedByUserId = changedByUserId ?? "Admin",
            ChangedAt = DateTime.UtcNow,
            Notes = notes ?? $"Status updated to {newStatus}.",
        });

        await _db.SaveChangesAsync();

        _logger.LogInformation("Order #{OrderNumber} transitioned from {Previous} to {New} by {User}.", order.OrderNumber, previousStatus, newStatus, changedByUserId);
        return (true, $"Order status changed to {newStatus} successfully.", order);
    }

    public async Task<IEnumerable<OrderStatusHistory>> GetStatusHistoryAsync(string orderId)
    {
        return await _db.OrderStatusHistory
            .Where(h => h.OrderId == orderId || h.Order!.OrderNumber == orderId)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderByNumberOrReferenceAsync(string reference)
    {
        return await _db.Orders
            .Include(o => o.OrderDetails)
            .Include(o => o.Attachments)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o =>
                o.OrderNumber == reference ||
                o.OrderId == reference ||
                o.WhatsAppReference == reference);
    }
}
