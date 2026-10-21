using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FCBoosting.Api.Models;

public class ServiceEntity
{
    [Key]
    [MaxLength(100)]
    public string ServiceId { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    public bool IsActive { get; set; } = true;

    [MaxLength(2000)]
    public string ServiceRequirements { get; set; } = string.Empty;
}
