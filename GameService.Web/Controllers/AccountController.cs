using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Data;
using GameService.Web.Models;
using GameService.Web.Services;
using GameService.Web.ViewModels.Auth;
using GameService.Web.ViewModels.Player;

namespace GameService.Web.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IFileStorageService _fileStorage;
        private readonly IConfiguration _configuration;

        public AccountController(
            ApplicationDbContext context,
            IFileStorageService fileStorage,
            IConfiguration configuration)
        {
            _context = context;
            _fileStorage = fileStorage;
            _configuration = configuration;
        }

        // ==========================================
        // 1. UNIFIED LOGIN
        // ==========================================
        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectByUserCategory();
            }

            ViewData["ReturnUrl"] = returnUrl;
            return View(new LoginViewModel { ReturnUrl = returnUrl });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == model.Email.ToLower().Trim());
            if (user == null || !BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
            {
                ModelState.AddModelError(string.Empty, "Invalid email or password.");
                return View(model);
            }

            if (user.Status == "Suspended")
            {
                ModelState.AddModelError(string.Empty, "Your account has been suspended. Please contact support.");
                return View(model);
            }

            // Map Category to Role
            string roleName = user.Category switch
            {
                'A' => "Admin",
                'C' => "Customer",
                'P' => "Player",
                _ => "Customer"
            };

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, roleName),
                new Claim("Category", user.Category.ToString()),
                new Claim("UserStatus", user.Status)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = model.RememberMe,
                ExpiresUtc = model.RememberMe ? DateTimeOffset.UtcNow.AddDays(14) : DateTimeOffset.UtcNow.AddHours(8)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            // Handle Players under review or rejected
            if (user.Category == 'P' && user.Status != "Approved")
            {
                return RedirectToAction(nameof(ApplicationStatus));
            }

            // Redirect by role
            return user.Category switch
            {
                'A' => RedirectToAction("Dashboard", "Admin"),
                'C' => RedirectToAction("Dashboard", "Customer"),
                'P' => RedirectToAction("Dashboard", "Player"),
                _ => RedirectToAction("Index", "Home")
            };
        }

        // ==========================================
        // 2. CUSTOMER SIGNUP
        // ==========================================
        [HttpGet]
        public IActionResult Register()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectByUserCategory();
            }
            return View(new RegisterCustomerViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterCustomerViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            string cleanEmail = model.Email.Trim().ToLowerInvariant();
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == cleanEmail))
            {
                ModelState.AddModelError(nameof(model.Email), "An account with this email already exists.");
                return View(model);
            }

            var customer = new User
            {
                FullName = model.FullName.Trim(),
                Email = cleanEmail,
                Phone = model.Phone.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Category = 'C',
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(customer);
            await _context.SaveChangesAsync();

            // Auto Sign-in
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                new Claim(ClaimTypes.Name, customer.FullName),
                new Claim(ClaimTypes.Email, customer.Email),
                new Claim(ClaimTypes.Role, "Customer"),
                new Claim("Category", "C"),
                new Claim("UserStatus", customer.Status)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity));

            TempData["SuccessMessage"] = "Welcome! Your customer account has been created successfully.";
            return RedirectToAction("Dashboard", "Customer");
        }

        // ==========================================
        // 3. PLAYER "JOIN OUR TEAM" APPLICATION (PUBLIC)
        // ==========================================
        [HttpGet]
        public IActionResult JoinTeam()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return RedirectByUserCategory();
            }

            var model = new JoinTeamViewModel
            {
                AgreementVersion = _configuration["AppSettings:AgreementVersion"] ?? "v1.0"
            };
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JoinTeam(JoinTeamViewModel model)
        {
            string cleanEmail = model.Email.Trim().ToLowerInvariant();

            // Check if email already registered
            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == cleanEmail))
            {
                ModelState.AddModelError(nameof(model.Email), "An account with this email address already exists.");
            }

            // Calculate exact age
            var today = DateTime.Today;
            var birthDate = model.DateOfBirth.Date;
            int age = today.Year - birthDate.Year;
            if (birthDate > today.AddYears(-age)) age--;

            int minAdultAge = _configuration.GetValue<int>("AppSettings:MinimumAdultAge", 18);
            bool isAdult = age >= minAdultAge;

            // Validate Adult vs Minor Requirements
            if (isAdult)
            {
                if (string.IsNullOrWhiteSpace(model.CnicNumber))
                {
                    ModelState.AddModelError(nameof(model.CnicNumber), "National ID / CNIC Number is required for adult applicants.");
                }

                if (model.CnicFrontFile == null)
                {
                    ModelState.AddModelError(nameof(model.CnicFrontFile), "CNIC Front Image is required for adult applicants.");
                }
                else if (!_fileStorage.IsFileValid(model.CnicFrontFile, out string errorFront))
                {
                    ModelState.AddModelError(nameof(model.CnicFrontFile), errorFront);
                }

                if (model.CnicBackFile == null)
                {
                    ModelState.AddModelError(nameof(model.CnicBackFile), "CNIC Back Image is required for adult applicants.");
                }
                else if (!_fileStorage.IsFileValid(model.CnicBackFile, out string errorBack))
                {
                    ModelState.AddModelError(nameof(model.CnicBackFile), errorBack);
                }

                if (model.SupportingDocumentFile != null && !_fileStorage.IsFileValid(model.SupportingDocumentFile, out string errorSupport))
                {
                    ModelState.AddModelError(nameof(model.SupportingDocumentFile), errorSupport);
                }
            }
            else
            {
                // Minor applicant (< 18)
                if (model.GuardianConsentFile == null)
                {
                    ModelState.AddModelError(nameof(model.GuardianConsentFile), "Guardian Consent Document is required for applicants under 18 years of age.");
                }
                else if (!_fileStorage.IsFileValid(model.GuardianConsentFile, out string errorGuardian))
                {
                    ModelState.AddModelError(nameof(model.GuardianConsentFile), errorGuardian);
                }
            }

            // Validate gameplay screenshots
            if (model.GameplayScreenshots == null || model.GameplayScreenshots.Count == 0)
            {
                ModelState.AddModelError(nameof(model.GameplayScreenshots), "At least one gameplay/rank screenshot is required.");
            }
            else
            {
                foreach (var shot in model.GameplayScreenshots)
                {
                    if (!_fileStorage.IsFileValid(shot, out string shotError))
                    {
                        ModelState.AddModelError(nameof(model.GameplayScreenshots), $"Screenshot error: {shotError}");
                        break;
                    }
                }
            }

            if (!model.AcceptAgreement)
            {
                ModelState.AddModelError(nameof(model.AcceptAgreement), "You must accept the Player Agreement to join.");
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Create User with Category = 'P', Status = 'Pending'
            var playerUser = new User
            {
                FullName = model.FullName.Trim(),
                Email = cleanEmail,
                Phone = model.Phone.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Category = 'P',
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Users.AddAsync(playerUser);
            await _context.SaveChangesAsync();

            // Save documents in secure location outside wwwroot
            string userFolder = $"PlayerDocs/{playerUser.Id}";
            var docPathsList = new List<string>();

            if (isAdult)
            {
                if (model.CnicFrontFile != null)
                {
                    string frontPath = await _fileStorage.SaveSecureFileAsync(model.CnicFrontFile, userFolder);
                    docPathsList.Add($"CNIC_Front:{frontPath}");
                }

                if (model.CnicBackFile != null)
                {
                    string backPath = await _fileStorage.SaveSecureFileAsync(model.CnicBackFile, userFolder);
                    docPathsList.Add($"CNIC_Back:{backPath}");
                }

                if (model.SupportingDocumentFile != null)
                {
                    string supportPath = await _fileStorage.SaveSecureFileAsync(model.SupportingDocumentFile, userFolder);
                    docPathsList.Add($"Supporting_Doc:{supportPath}");
                }
            }
            else
            {
                if (model.GuardianConsentFile != null)
                {
                    string guardianPath = await _fileStorage.SaveSecureFileAsync(model.GuardianConsentFile, userFolder);
                    docPathsList.Add($"Guardian_Consent:{guardianPath}");
                }
            }

            // Save screenshots
            var screenshotPathsList = new List<string>();
            foreach (var shot in model.GameplayScreenshots)
            {
                string shotPath = await _fileStorage.SaveSecureFileAsync(shot, $"GameplayProofs/{playerUser.Id}");
                screenshotPathsList.Add(shotPath);
            }

            // Create PlayerApplication record
            var application = new PlayerApplication
            {
                UserId = playerUser.Id,
                DateOfBirth = model.DateOfBirth,
                IsAdult = isAdult,
                CnicNumber = isAdult ? model.CnicNumber : null,
                DocumentPaths = JsonSerializer.Serialize(docPathsList),
                ScreenshotPaths = JsonSerializer.Serialize(screenshotPathsList),
                ApplicationStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _context.PlayerApplications.AddAsync(application);

            // Record Agreement Acceptance with timestamp and IP address
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var agreementAcceptance = new AgreementAcceptance
            {
                UserId = playerUser.Id,
                AgreementVersion = model.AgreementVersion,
                AcceptedAt = DateTime.UtcNow,
                IpAddress = ip
            };

            await _context.AgreementAcceptances.AddAsync(agreementAcceptance);
            await _context.SaveChangesAsync();

            // Automatically sign in the player and route them to application status
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, playerUser.Id.ToString()),
                new Claim(ClaimTypes.Name, playerUser.FullName),
                new Claim(ClaimTypes.Email, playerUser.Email),
                new Claim(ClaimTypes.Role, "Player"),
                new Claim("Category", "P"),
                new Claim("UserStatus", playerUser.Status)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity));

            return RedirectToAction(nameof(ApplicationStatus));
        }

        // ==========================================
        // 4. PLAYER APPLICATION UNDER REVIEW
        // ==========================================
        [Authorize(Roles = "Player")]
        [HttpGet]
        public async Task<IActionResult> ApplicationStatus()
        {
            int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _context.Users
                .Include(u => u.Applications)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                await HttpContext.SignOutAsync();
                return RedirectToAction(nameof(Login));
            }

            // If player is approved, redirect to dashboard
            if (user.Status == "Approved")
            {
                return RedirectToAction("Dashboard", "Player");
            }

            var app = user.Applications.OrderByDescending(a => a.CreatedAt).FirstOrDefault();
            return View(app);
        }

        // ==========================================
        // 5. LOGOUT
        // ==========================================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction(nameof(Login));
        }

        // ==========================================
        // 6. ACCESS DENIED
        // ==========================================
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }

        // ==========================================
        // 7. ONE-CLICK DEMO ROLE SWITCHER
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> QuickLogin(string role)
        {
            User? targetUser = null;
            if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
            {
                targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Category == 'A');
            }
            else if (string.Equals(role, "Customer", StringComparison.OrdinalIgnoreCase))
            {
                targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Category == 'C');
            }
            else if (string.Equals(role, "Player", StringComparison.OrdinalIgnoreCase))
            {
                targetUser = await _context.Users.FirstOrDefaultAsync(u => u.Category == 'P' && u.Status == "Approved");
            }

            if (targetUser == null)
            {
                TempData["ErrorMessage"] = $"No active {role} account found.";
                return RedirectToAction(nameof(Login));
            }

            string roleName = targetUser.Category switch
            {
                'A' => "Admin",
                'C' => "Customer",
                'P' => "Player",
                _ => "Customer"
            };

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, targetUser.Id.ToString()),
                new Claim(ClaimTypes.Name, targetUser.FullName),
                new Claim(ClaimTypes.Email, targetUser.Email),
                new Claim(ClaimTypes.Role, roleName),
                new Claim("Category", targetUser.Category.ToString()),
                new Claim("UserStatus", targetUser.Status)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));

            return targetUser.Category switch
            {
                'A' => RedirectToAction("Dashboard", "Admin"),
                'C' => RedirectToAction("Dashboard", "Customer"),
                'P' => RedirectToAction("Dashboard", "Player"),
                _ => RedirectToAction("Index", "Home")
            };
        }

        private IActionResult RedirectByUserCategory()
        {
            var categoryClaim = User.FindFirst("Category")?.Value;
            var statusClaim = User.FindFirst("UserStatus")?.Value;

            if (categoryClaim == "A")
                return RedirectToAction("Dashboard", "Admin");
            if (categoryClaim == "C")
                return RedirectToAction("Dashboard", "Customer");
            if (categoryClaim == "P")
            {
                if (statusClaim == "Approved")
                    return RedirectToAction("Dashboard", "Player");
                return RedirectToAction(nameof(ApplicationStatus));
            }

            return RedirectToAction("Index", "Home");
        }
    }
}
