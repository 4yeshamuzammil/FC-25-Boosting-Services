using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class User
{
    [Key]
    [MaxLength(450)]
    public string UserId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(100)]
    public string DisplayName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(256)]
    public string? GoogleSubjectId { get; set; }

    [MaxLength(256)]
    public string? DiscordUserId { get; set; }

    [MaxLength(100)]
    public string? DiscordTag { get; set; }

    public string Role { get; set; } = "Customer"; // "Customer" or "Admin"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<ExternalAccount> ExternalAccounts { get; set; } = new List<ExternalAccount>();
}
