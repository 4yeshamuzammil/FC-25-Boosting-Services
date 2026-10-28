using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GameService.Web.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [Phone]
        [StringLength(50)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// 'A' = Admin, 'C' = Customer, 'P' = Player
        /// </summary>
        [Required]
        public char Category { get; set; }

        /// <summary>
        /// 'Active', 'Pending', 'Approved', 'Rejected', 'Suspended'
        /// </summary>
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [InverseProperty("Customer")]
        public virtual ICollection<Order> CustomerOrders { get; set; } = new List<Order>();

        [InverseProperty("AssignedPlayer")]
        public virtual ICollection<Order> AssignedOrders { get; set; } = new List<Order>();

        public virtual ICollection<PlayerApplication> Applications { get; set; } = new List<PlayerApplication>();
        public virtual ICollection<PlayerEarning> Earnings { get; set; } = new List<PlayerEarning>();
        public virtual ICollection<AgreementAcceptance> AgreementAcceptances { get; set; } = new List<AgreementAcceptance>();
        public virtual ICollection<AuditLog> AuditLogs { get; set; } = new List<AuditLog>();
    }
}
