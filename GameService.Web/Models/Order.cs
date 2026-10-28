using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameService.Web.Models
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        [StringLength(100)]
        public string GameName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string ServiceType { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string TargetRank { get; set; } = string.Empty;

        public string? Details { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Range(1, 1000000)]
        public decimal Amount { get; set; }

        /// <summary>
        /// 'Open', 'Assigned', 'InProgress', 'Completed', 'Cancelled'
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Open";

        public int? AssignedPlayerId { get; set; }

        public DateTime? AssignedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey("CustomerId")]
        public virtual User Customer { get; set; } = null!;

        [ForeignKey("AssignedPlayerId")]
        public virtual User? AssignedPlayer { get; set; }

        public virtual ICollection<PlayerEarning> Earnings { get; set; } = new List<PlayerEarning>();
    }
}
