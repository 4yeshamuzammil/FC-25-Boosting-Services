using GameService.Web.Models;

namespace GameService.Web.ViewModels.Admin
{
    public class PlayerListItemViewModel
    {
        public int PlayerId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int CompletedOrdersCount { get; set; }
        public decimal TotalEarnings { get; set; }
        public decimal UnpaidEarnings { get; set; }
        public decimal PaidEarnings { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    public class PlayerEarningsManagementViewModel
    {
        public List<PlayerListItemViewModel> Players { get; set; } = new List<PlayerListItemViewModel>();
        public List<PlayerEarning> DetailedEarnings { get; set; } = new List<PlayerEarning>();
    }
}
