using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Data;
using GameService.Web.Models;
using GameService.Web.Services;
using GameService.Web.ViewModels.Admin;

namespace GameService.Web.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileStorageService _fileStorage;
        private readonly IAuditService _auditService;

        public AdminController(
            ApplicationDbContext context,
            IFileStorageService fileStorage,
            IAuditService auditService)
        {
            _context = context;
            _fileStorage = fileStorage;
            _auditService = auditService;
        }

        private int CurrentAdminId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        private string CurrentIp => HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

        // ==========================================
        // 1. DASHBOARD
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Dashboard()
        {
            var now = DateTime.UtcNow;
            var firstDayOfMonth = new DateTime(now.Year, now.Month, 1);

            var totalOrders = await _context.Orders.CountAsync();
            var ordersThisMonth = await _context.Orders.CountAsync(o => o.CreatedAt >= firstDayOfMonth);
            var totalAmountThisMonth = await _context.Orders
                .Where(o => o.CreatedAt >= firstDayOfMonth)
                .SumAsync(o => (decimal?)o.Amount) ?? 0m;
            var allTimeAmount = await _context.Orders
                .SumAsync(o => (decimal?)o.Amount) ?? 0m;

            var totalCustomers = await _context.Users.CountAsync(u => u.Category == 'C');
            var totalApprovedPlayers = await _context.Users.CountAsync(u => u.Category == 'P' && u.Status == "Approved");
            var pendingApplications = await _context.PlayerApplications.CountAsync(a => a.ApplicationStatus == "Pending");

            var ordersByStatus = await _context.Orders
                .GroupBy(o => o.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);

            // Last 6 months trend for chart
            var monthlyLabels = new List<string>();
            var monthlyOrdersCount = new List<int>();
            var monthlyRevenue = new List<decimal>();

            for (int i = 5; i >= 0; i--)
            {
                var monthDate = now.AddMonths(-i);
                var monthStart = new DateTime(monthDate.Year, monthDate.Month, 1);
                var monthEnd = monthStart.AddMonths(1);

                string label = monthStart.ToString("MMM yyyy");
                int count = await _context.Orders.CountAsync(o => o.CreatedAt >= monthStart && o.CreatedAt < monthEnd);
                decimal rev = await _context.Orders.Where(o => o.CreatedAt >= monthStart && o.CreatedAt < monthEnd)
                    .SumAsync(o => (decimal?)o.Amount) ?? 0m;

                monthlyLabels.Add(label);
                monthlyOrdersCount.Add(count);
                monthlyRevenue.Add(rev);
            }

            var recentOrders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.AssignedPlayer)
                .OrderByDescending(o => o.CreatedAt)
                .Take(7)
                .ToListAsync();

            var vm = new AdminDashboardViewModel
            {
                TotalOrdersReceived = totalOrders,
                OrdersThisMonth = ordersThisMonth,
                TotalAmountThisMonth = totalAmountThisMonth,
                AllTimeAmount = allTimeAmount,
                TotalCustomers = totalCustomers,
                TotalApprovedPlayers = totalApprovedPlayers,
                PendingPlayerApplications = pendingApplications,
                OrdersByStatus = ordersByStatus,
                MonthlyLabels = monthlyLabels,
                MonthlyOrdersCount = monthlyOrdersCount,
                MonthlyRevenue = monthlyRevenue,
                RecentOrders = recentOrders
            };

            return View(vm);
        }

        // ==========================================
        // 2. ORDERS MANAGEMENT GRID
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Orders(string? status, DateTime? fromDate, DateTime? toDate, int? playerId)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.AssignedPlayer)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(o => o.Status == status);
            }

            if (fromDate.HasValue)
            {
                query = query.Where(o => o.CreatedAt >= fromDate.Value.Date);
            }

            if (toDate.HasValue)
            {
                var inclusiveTo = toDate.Value.Date.AddDays(1);
                query = query.Where(o => o.CreatedAt < inclusiveTo);
            }

            if (playerId.HasValue)
            {
                query = query.Where(o => o.AssignedPlayerId == playerId.Value);
            }

            var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
            var approvedPlayers = await _context.Users
                .Where(u => u.Category == 'P' && u.Status == "Approved")
                .OrderBy(u => u.FullName)
                .ToListAsync();

            var vm = new OrdersFilterViewModel
            {
                Status = status,
                FromDate = fromDate,
                ToDate = toDate,
                PlayerId = playerId,
                Orders = orders,
                ApprovedPlayers = approvedPlayers
            };

            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ReassignOrder(int orderId, int newPlayerId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                TempData["ErrorMessage"] = "Order not found.";
                return RedirectToAction(nameof(Orders));
            }

            var newPlayer = await _context.Users.FirstOrDefaultAsync(u => u.Id == newPlayerId && u.Category == 'P' && u.Status == "Approved");
            if (newPlayer == null)
            {
                TempData["ErrorMessage"] = "Selected player is not valid or not approved.";
                return RedirectToAction(nameof(Orders));
            }

            int? previousPlayerId = order.AssignedPlayerId;
            order.AssignedPlayerId = newPlayer.Id;
            order.Status = "Assigned";
            order.AssignedAt = DateTime.UtcNow;

            // Update or recreate PlayerEarnings for new player
            var existingEarning = await _context.PlayerEarnings.FirstOrDefaultAsync(e => e.OrderId == order.Id);
            decimal earningAmount = Math.Round(order.Amount * 0.70m, 2);

            if (existingEarning != null)
            {
                existingEarning.PlayerId = newPlayer.Id;
                existingEarning.Amount = earningAmount;
                existingEarning.PaidStatus = "Unpaid";
            }
            else
            {
                await _context.PlayerEarnings.AddAsync(new PlayerEarning
                {
                    PlayerId = newPlayer.Id,
                    OrderId = order.Id,
                    Amount = earningAmount,
                    PaidStatus = "Unpaid",
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();

            await _auditService.LogActionAsync(
                CurrentAdminId,
                "ReassignOrder",
                "Orders",
                order.Id,
                $"Reassigned from PlayerId '{previousPlayerId}' to PlayerId '{newPlayer.Id}' ({newPlayer.FullName})",
                CurrentIp);

            TempData["SuccessMessage"] = $"Order #{order.Id} successfully reassigned to {newPlayer.FullName}.";
            return RedirectToAction(nameof(Orders));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CancelOrder(int orderId, string? cancelReason)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                TempData["ErrorMessage"] = "Order not found.";
                return RedirectToAction(nameof(Orders));
            }

            order.Status = "Cancelled";
            await _context.SaveChangesAsync();

            await _auditService.LogActionAsync(
                CurrentAdminId,
                "CancelOrder",
                "Orders",
                order.Id,
                $"Order cancelled. Reason: {cancelReason ?? "Admin decision"}",
                CurrentIp);

            TempData["SuccessMessage"] = $"Order #{order.Id} has been cancelled.";
            return RedirectToAction(nameof(Orders));
        }

        // ==========================================
        // 3. CUSTOMERS GRID
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Customers()
        {
            var customers = await _context.Users
                .Where(u => u.Category == 'C')
                .Include(u => u.CustomerOrders)
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return View(customers);
        }

        // ==========================================
        // 4. PLAYER APPLICATIONS GRID & REVIEW
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Applications(string? status)
        {
            var query = _context.PlayerApplications
                .Include(a => a.User)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(a => a.ApplicationStatus == status);
            }

            var list = await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
            ViewData["CurrentStatus"] = status;
            return View(list);
        }

        [HttpGet]
        public async Task<IActionResult> ReviewApplication(int id)
        {
            var app = await _context.PlayerApplications
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (app == null)
            {
                TempData["ErrorMessage"] = "Application not found.";
                return RedirectToAction(nameof(Applications));
            }

            var vm = new ReviewApplicationViewModel
            {
                Application = app,
                Applicant = app.User,
                AdminRemarks = app.AdminRemarks,
                Decision = app.ApplicationStatus == "Pending" ? "Approve" : app.ApplicationStatus
            };

            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ProcessApplicationDecision(int applicationId, string decision, string? adminRemarks)
        {
            var app = await _context.PlayerApplications
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (app == null)
            {
                TempData["ErrorMessage"] = "Application not found.";
                return RedirectToAction(nameof(Applications));
            }

            bool isApprove = string.Equals(decision, "Approve", StringComparison.OrdinalIgnoreCase);
            string newStatus = isApprove ? "Approved" : "Rejected";

            app.ApplicationStatus = newStatus;
            app.AdminRemarks = adminRemarks?.Trim();
            app.ReviewedAt = DateTime.UtcNow;

            app.User.Status = newStatus;

            await _context.SaveChangesAsync();

            await _auditService.LogActionAsync(
                CurrentAdminId,
                isApprove ? "ApprovePlayerApplication" : "RejectPlayerApplication",
                "PlayerApplications",
                app.Id,
                $"Applicant: {app.User.FullName} ({app.User.Email}). Remarks: {adminRemarks}",
                CurrentIp);

            TempData["SuccessMessage"] = $"Player application for {app.User.FullName} has been {newStatus.ToLowerInvariant()}.";
            return RedirectToAction(nameof(Applications));
        }

        // ==========================================
        // 5. PLAYERS MANAGEMENT & EARNINGS
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Players()
        {
            var players = await _context.Users
                .Where(u => u.Category == 'P')
                .Include(u => u.AssignedOrders)
                .Include(u => u.Earnings)
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            var list = players.Select(p => new PlayerListItemViewModel
            {
                PlayerId = p.Id,
                FullName = p.FullName,
                Email = p.Email,
                Phone = p.Phone,
                Status = p.Status,
                CompletedOrdersCount = p.AssignedOrders.Count(o => o.Status == "Completed"),
                TotalEarnings = p.Earnings.Sum(e => e.Amount),
                UnpaidEarnings = p.Earnings.Where(e => e.PaidStatus == "Unpaid").Sum(e => e.Amount),
                PaidEarnings = p.Earnings.Where(e => e.PaidStatus == "Paid").Sum(e => e.Amount),
                JoinedAt = p.CreatedAt
            }).ToList();

            var detailedEarnings = await _context.PlayerEarnings
                .Include(e => e.Player)
                .Include(e => e.Order)
                .OrderByDescending(e => e.CreatedAt)
                .Take(50)
                .ToListAsync();

            var vm = new PlayerEarningsManagementViewModel
            {
                Players = list,
                DetailedEarnings = detailedEarnings
            };

            return View(vm);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> MarkEarningsAsPaid(int playerId)
        {
            var unpaidEarnings = await _context.PlayerEarnings
                .Where(e => e.PlayerId == playerId && e.PaidStatus == "Unpaid")
                .ToListAsync();

            if (unpaidEarnings.Count == 0)
            {
                TempData["ErrorMessage"] = "No unpaid earnings found for this player.";
                return RedirectToAction(nameof(Players));
            }

            decimal totalPaid = 0m;
            foreach (var earning in unpaidEarnings)
            {
                earning.PaidStatus = "Paid";
                earning.PaidAt = DateTime.UtcNow;
                totalPaid += earning.Amount;
            }

            await _context.SaveChangesAsync();

            var player = await _context.Users.FindAsync(playerId);
            await _auditService.LogActionAsync(
                CurrentAdminId,
                "MarkEarningsPaid",
                "PlayerEarnings",
                playerId,
                $"Marked {unpaidEarnings.Count} orders as Paid. Total amount: ${totalPaid:F2} for player {player?.FullName}",
                CurrentIp);

            TempData["SuccessMessage"] = $"Successfully marked ${totalPaid:F2} in earnings as Paid for {player?.FullName}.";
            return RedirectToAction(nameof(Players));
        }

        // ==========================================
        // 6. SECURE DOCUMENT SERVING (ADMIN ONLY)
        // ==========================================
        [HttpGet]
        public IActionResult DownloadSecureDocument(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return BadRequest("File path is required.");
            }

            var fileResult = _fileStorage.GetSecureFile(path);
            if (fileResult == null)
            {
                return NotFound("The requested document was not found or access is restricted.");
            }

            return File(fileResult.Value.Stream, fileResult.Value.ContentType, fileResult.Value.FileName);
        }

        // ==========================================
        // 7. AUDIT LOGS
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> AuditLogs()
        {
            var logs = await _context.AuditLogs
                .Include(l => l.AdminUser)
                .OrderByDescending(l => l.Timestamp)
                .Take(200)
                .ToListAsync();

            return View(logs);
        }
    }
}
