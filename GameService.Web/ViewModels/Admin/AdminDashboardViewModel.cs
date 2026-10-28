using GameService.Web.Models;

namespace GameService.Web.ViewModels.Admin
{
    public class AdminDashboardViewModel
    {
        public int TotalOrdersReceived { get; set; }
        public int OrdersThisMonth { get; set; }
        public decimal TotalAmountThisMonth { get; set; }
        public decimal AllTimeAmount { get; set; }

        public int TotalCustomers { get; set; }
        public int TotalApprovedPlayers { get; set; }
        public int PendingPlayerApplications { get; set; }

        public Dictionary<string, int> OrdersByStatus { get; set; } = new Dictionary<string, int>();

        // Chart data
        public List<string> MonthlyLabels { get; set; } = new List<string>();
        public List<int> MonthlyOrdersCount { get; set; } = new List<int>();
        public List<decimal> MonthlyRevenue { get; set; } = new List<decimal>();

        public List<Order> RecentOrders { get; set; } = new List<Order>();
    }
}
