using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class ExternalAccount
{
    [Key]
    [MaxLength(450)]
    public string ExternalAccountId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(450)]
    public string UserId { get; set; } = string.Empty;

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }

    [Required]
    [MaxLength(50)]
    public string Provider { get; set; } = string.Empty; // "Google" or "Discord"

    [Required]
    [MaxLength(256)]
    public string ProviderSubjectId { get; set; } = string.Empty;

    public DateTime LinkedAt { get; set; } = DateTime.UtcNow;
}
