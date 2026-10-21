using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderDetail
{
    [Key]
    [MaxLength(450)]
    public string OrderDetailId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(100)]
    public string FieldName { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string FieldValue { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
