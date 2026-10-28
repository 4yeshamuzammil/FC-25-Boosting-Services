using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameService.Web.Models
{
    [Table("AgreementAcceptances")]
    public class AgreementAcceptance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(50)]
        public string AgreementVersion { get; set; } = "v1.0";

        public DateTime AcceptedAt { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string? IpAddress { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
