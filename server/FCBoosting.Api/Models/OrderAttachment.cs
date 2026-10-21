using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class OrderAttachment
{
    [Key]
    [MaxLength(450)]
    public string AttachmentId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(450)]
    public string OrderId { get; set; } = string.Empty;

    [ForeignKey(nameof(OrderId))]
    public Order? Order { get; set; }

    [Required]
    [MaxLength(256)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string StorageKey { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    [MaxLength(450)]
    public string UploadedByUserId { get; set; } = string.Empty;

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
}
