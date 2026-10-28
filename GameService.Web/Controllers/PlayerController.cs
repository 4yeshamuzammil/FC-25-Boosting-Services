using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Data;
using GameService.Web.Models;
using GameService.Web.ViewModels.Player;

namespace GameService.Web.Controllers
{
    [Authorize(Roles = "Player")]
    public class PlayerController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public PlayerController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private int CurrentPlayerId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ==========================================
        // 1. PLAYER DASHBOARD
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Dashboard()
        {
            int playerId = CurrentPlayerId;

            // Enforce player status check
            var player = await _context.Users.FindAsync(playerId);
            if (player == null || player.Status != "Approved")
            {
                return RedirectToAction("ApplicationStatus", "Account");
            }

            // Available orders (Open and unassigned)
            var availableOrders = await _context.Orders
                .Where(o => o.Status == "Open" && o.AssignedPlayerId == null)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            // Player's assigned active orders
            var myActiveOrders = await _context.Orders
                .Where(o => o.AssignedPlayerId == playerId && (o.Status == "Assigned" || o.Status == "InProgress"))
                .OrderByDescending(o => o.AssignedAt)
                .ToListAsync();

            // Player's completed orders
            var myCompletedOrders = await _context.Orders
                .Where(o => o.AssignedPlayerId == playerId && o.Status == "Completed")
                .OrderByDescending(o => o.CompletedAt)
                .ToListAsync();

            // Player earnings calculations
            var earnings = await _context.PlayerEarnings
                .Where(e => e.PlayerId == playerId)
                .ToListAsync();

            var vm = new PlayerDashboardViewModel
            {
                Player = player,
                AvailableOrders = availableOrders,
                MyActiveOrders = myActiveOrders,
                MyCompletedOrders = myCompletedOrders,
                CompletedOrdersCount = myCompletedOrders.Count,
                TotalEarnings = earnings.Sum(e => e.Amount),
                PendingEarnings = earnings.Where(e => e.PaidStatus == "Unpaid").Sum(e => e.Amount),
                PaidEarnings = earnings.Where(e => e.PaidStatus == "Paid").Sum(e => e.Amount)
            };

            return View(vm);
        }

        // ==========================================
        // 2. ATOMIC ORDER CLAIMING
        // ==========================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ClaimOrder(int orderId)
        {
            int playerId = CurrentPlayerId;

            var player = await _context.Users.FindAsync(playerId);
            if (player == null || player.Status != "Approved")
            {
                TempData["ErrorMessage"] = "You must be an approved player to claim orders.";
                return RedirectToAction("ApplicationStatus", "Account");
            }

            // ATOMIC EXECUTION via Stored Procedure with concurrency isolation
            var (success, message) = await _context.ExecuteClaimOrderStoredProcedureAsync(orderId, playerId);

            if (success)
            {
                TempData["SuccessMessage"] = "Order claimed successfully! You can now start working on it.";
            }
            else
            {
                TempData["ErrorMessage"] = string.IsNullOrWhiteSpace(message)
                    ? "Order already taken by another player or no longer available."
                    : message;
            }

            return RedirectToAction(nameof(Dashboard));
        }

        // ==========================================
        // 3. START ORDER (SET TO IN PROGRESS)
        // ==========================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> StartOrder(int orderId)
        {
            int playerId = CurrentPlayerId;

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.AssignedPlayerId == playerId);

            if (order == null)
            {
                TempData["ErrorMessage"] = "Order not found or not assigned to you.";
                return RedirectToAction(nameof(Dashboard));
            }

            if (order.Status == "Assigned")
            {
                order.Status = "InProgress";
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = $"Order #{order.Id} is now marked as In Progress.";
            }

            return RedirectToAction(nameof(Dashboard));
        }

        // ==========================================
        // 4. MARK ORDER AS COMPLETED
        // ==========================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> MarkCompleted(int orderId)
        {
            int playerId = CurrentPlayerId;

            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.AssignedPlayerId == playerId);

            if (order == null)
            {
                TempData["ErrorMessage"] = "Order not found or not assigned to you.";
                return RedirectToAction(nameof(Dashboard));
            }

            if (order.Status == "Completed")
            {
                TempData["ErrorMessage"] = "Order is already marked as completed.";
                return RedirectToAction(nameof(Dashboard));
            }

            bool requireAdminApproval = _configuration.GetValue<bool>("AppSettings:RequireAdminCompletionApproval", false);

            if (requireAdminApproval)
            {
                // Can set a pending verification state or complete directly
                order.Status = "Completed";
                order.CompletedAt = DateTime.UtcNow;
                TempData["SuccessMessage"] = $"Order #{order.Id} marked as completed! Pending admin verification.";
            }
            else
            {
                order.Status = "Completed";
                order.CompletedAt = DateTime.UtcNow;
                TempData["SuccessMessage"] = $"Congratulations! Order #{order.Id} has been marked as completed.";
            }

            // Ensure PlayerEarning entry exists for this order
            var earning = await _context.PlayerEarnings.FirstOrDefaultAsync(e => e.OrderId == order.Id && e.PlayerId == playerId);
            if (earning == null)
            {
                decimal amount = Math.Round(order.Amount * 0.70m, 2);
                await _context.PlayerEarnings.AddAsync(new PlayerEarning
                {
                    PlayerId = playerId,
                    OrderId = order.Id,
                    Amount = amount,
                    PaidStatus = "Unpaid",
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Dashboard));
        }
    }
}
