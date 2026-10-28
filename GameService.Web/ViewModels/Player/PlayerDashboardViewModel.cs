using GameService.Web.Models;

namespace GameService.Web.ViewModels.Player
{
    public class PlayerDashboardViewModel
    {
        public User Player { get; set; } = null!;
        public List<Order> AvailableOrders { get; set; } = new List<Order>();
        public List<Order> MyActiveOrders { get; set; } = new List<Order>();
        public List<Order> MyCompletedOrders { get; set; } = new List<Order>();

        public int CompletedOrdersCount { get; set; }
        public decimal TotalEarnings { get; set; }
        public decimal PendingEarnings { get; set; }
        public decimal PaidEarnings { get; set; }
    }
}
