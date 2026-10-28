using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameService.Web.Models
{
    [Table("AuditLogs")]
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AdminUserId { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string TargetEntity { get; set; } = string.Empty;

        [Required]
        public int TargetId { get; set; }

        public string? Details { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string? IpAddress { get; set; }

        [ForeignKey("AdminUserId")]
        public virtual User AdminUser { get; set; } = null!;
    }
}
