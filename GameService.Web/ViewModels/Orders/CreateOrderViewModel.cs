using System.ComponentModel.DataAnnotations;

namespace GameService.Web.ViewModels.Orders
{
    public class CreateOrderViewModel
    {
        [Required(ErrorMessage = "Please select the Game Title")]
        [StringLength(100)]
        [Display(Name = "Game Title")]
        public string GameName { get; set; } = "EA Sports FC 25";

        [Required(ErrorMessage = "Please select the Service Type")]
        [StringLength(100)]
        [Display(Name = "Service Type")]
        public string ServiceType { get; set; } = "UT Champions Weekend League";

        [Required(ErrorMessage = "Please enter or select the Target Rank")]
        [StringLength(100)]
        [Display(Name = "Target Rank / Wins")]
        public string TargetRank { get; set; } = "Rank 1 (19-20 Wins)";

        [Display(Name = "Platform & Account Instructions (PS5 / Xbox / PC, Formation, Custom Tactics, Pack Handling)")]
        public string? Details { get; set; }

        [Required(ErrorMessage = "Please enter the Order Amount")]
        [Range(5, 100000, ErrorMessage = "Order amount must be between $5 and $100,000")]
        [Display(Name = "Price / Budget ($)")]
        public decimal Amount { get; set; } = 99.99m;
    }
}
