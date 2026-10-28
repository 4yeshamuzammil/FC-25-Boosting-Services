using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Data;
using GameService.Web.Models;
using GameService.Web.ViewModels.Orders;

namespace GameService.Web.Controllers
{
    [Authorize(Roles = "Customer")]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int CurrentCustomerId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // ==========================================
        // 1. DASHBOARD / OWN ORDERS
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> Dashboard()
        {
            int customerId = CurrentCustomerId;

            // Strict ownership verification
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.AssignedPlayer)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            ViewBag.TotalOrders = orders.Count;
            ViewBag.ActiveOrders = orders.Count(o => o.Status == "Assigned" || o.Status == "InProgress");
            ViewBag.CompletedOrders = orders.Count(o => o.Status == "Completed");
            ViewBag.TotalSpent = orders.Sum(o => o.Amount);

            return View(orders);
        }

        // ==========================================
        // 2. PLACE NEW ORDER
        // ==========================================
        [HttpGet]
        public IActionResult CreateOrder()
        {
            return View(new CreateOrderViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateOrder(CreateOrderViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            int customerId = CurrentCustomerId;

            var order = new Order
            {
                CustomerId = customerId,
                GameName = model.GameName.Trim(),
                ServiceType = model.ServiceType.Trim(),
                TargetRank = model.TargetRank.Trim(),
                Details = model.Details?.Trim(),
                Amount = model.Amount,
                Status = "Open",
                AssignedPlayerId = null,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            TempData["SuccessMessage"] = $"Order #{order.Id} placed successfully! Our top-rated players will claim and start working on it.";
            return RedirectToAction(nameof(Dashboard));
        }

        // ==========================================
        // 3. ORDER DETAILS (OWNERSHIP ENFORCED)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> OrderDetails(int id)
        {
            int customerId = CurrentCustomerId;

            // Ownership check: must match CustomerId
            var order = await _context.Orders
                .Include(o => o.AssignedPlayer)
                .FirstOrDefaultAsync(o => o.Id == id && o.CustomerId == customerId);

            if (order == null)
            {
                TempData["ErrorMessage"] = "Order not found or you do not have permission to view it.";
                return RedirectToAction(nameof(Dashboard));
            }

            return View(order);
        }
    }
}
