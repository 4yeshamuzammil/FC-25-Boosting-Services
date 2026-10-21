using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderStatusHistory
{
    [Key]
    [MaxLength(450)]
    public string HistoryId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(50)]
    public string PreviousStatus { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string NewStatus { get; set; } = string.Empty;

    [MaxLength(450)]
    public string? ChangedByUserId { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(1000)]
    public string Notes { get; set; } = string.Empty;
}
