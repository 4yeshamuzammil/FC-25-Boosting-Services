using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameService.Web.Models
{
    [Table("PlayerEarnings")]
    public class PlayerEarning
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlayerId { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        /// <summary>
        /// 'Unpaid', 'Paid'
        /// </summary>
        [Required]
        [StringLength(50)]
        public string PaidStatus { get; set; } = "Unpaid";

        public DateTime? PaidAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("PlayerId")]
        public virtual User Player { get; set; } = null!;

        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; } = null!;
    }
}
