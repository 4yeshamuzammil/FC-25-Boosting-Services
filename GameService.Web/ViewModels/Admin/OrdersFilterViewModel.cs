using GameService.Web.Models;

namespace GameService.Web.ViewModels.Admin
{
    public class OrdersFilterViewModel
    {
        public string? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? PlayerId { get; set; }

        public List<Order> Orders { get; set; } = new List<Order>();
        public List<User> ApprovedPlayers { get; set; } = new List<User>();
    }
}
