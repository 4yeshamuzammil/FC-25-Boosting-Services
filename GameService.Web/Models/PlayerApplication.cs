using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameService.Web.Models
{
    [Table("PlayerApplications")]
    public class PlayerApplication
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        public bool IsAdult { get; set; } = true;

        [StringLength(50)]
        public string? CnicNumber { get; set; }

        public string? DocumentPaths { get; set; }

        public string? ScreenshotPaths { get; set; }

        /// <summary>
        /// 'Pending', 'Approved', 'Rejected'
        /// </summary>
        [Required]
        [StringLength(50)]
        public string ApplicationStatus { get; set; } = "Pending";

        public string? AdminRemarks { get; set; }

        public DateTime? ReviewedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}
