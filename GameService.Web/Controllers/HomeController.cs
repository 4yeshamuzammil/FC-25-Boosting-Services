using System.Diagnostics;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using GameService.Web.Models;

namespace GameService.Web.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                var role = User.FindFirstValue(ClaimTypes.Role);
                var category = User.FindFirst("Category")?.Value;
                var status = User.FindFirst("UserStatus")?.Value;

                if (category == "A" || role == "Admin")
                    return RedirectToAction("Dashboard", "Admin");

                if (category == "C" || role == "Customer")
                    return RedirectToAction("Dashboard", "Customer");

                if (category == "P" || role == "Player")
                {
                    if (status == "Approved")
                        return RedirectToAction("Dashboard", "Player");
                    return RedirectToAction("ApplicationStatus", "Account");
                }
            }

            return View();
        }

        public IActionResult Terms()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
