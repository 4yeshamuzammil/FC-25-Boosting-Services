using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderSessionToken
{
    [Key]
    [MaxLength(100)]
    public string Token { get; set; } = Guid.NewGuid().ToString("N");

    [Required]
    [MaxLength(50)]
    public string OrderReference { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ServiceId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string ServiceName { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal PriceSnapshot { get; set; }

    [MaxLength(50)]
    public string Platform { get; set; } = "PS5";

    [MaxLength(50)]
    public string TargetChannel { get; set; } = "WhatsApp"; // "WhatsApp" or "Discord"

    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(2);

    public bool IsUsed { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
