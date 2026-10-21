using FCBoosting.Api.Models;

namespace FCBoosting.Api.Services;

public interface IOrderLifecycleService
{
    Task<Order> CreateOrderAsync(
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
        Dictionary<string, string>? requirements = null);

    Task<(bool Success, string Message, Order? Order)> TransitionStatusAsync(
        string orderId,
        string newStatus,
        string? changedByUserId,
        string? notes);

    Task<IEnumerable<OrderStatusHistory>> GetStatusHistoryAsync(string orderId);

    Task<Order?> GetOrderByNumberOrReferenceAsync(string reference);
}
