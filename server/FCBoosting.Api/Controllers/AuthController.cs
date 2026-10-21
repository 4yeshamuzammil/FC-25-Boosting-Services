using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly FCBoostingDbContext _db;
    private readonly ILogger<AuthController> _logger;

    public AuthController(FCBoostingDbContext db, ILogger<AuthController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin([FromQuery] string returnUrl = "/")
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(GoogleCallback), new { returnUrl })
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallback([FromQuery] string returnUrl = "/")
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Google authentication failed.");
        }

        var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "Google User";

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(googleId))
        {
            return BadRequest("Required claims not provided by Google.");
        }

        // Link or create user in SQL Server
        var user = await _db.Users
            .Include(u => u.ExternalAccounts)
            .FirstOrDefaultAsync(u => u.GoogleSubjectId == googleId || u.Email == email);

        if (user == null)
        {
            user = new User
            {
                DisplayName = name,
                Email = email,
                GoogleSubjectId = googleId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            user.ExternalAccounts.Add(new ExternalAccount
            {
                Provider = "Google",
                ProviderSubjectId = googleId,
                LinkedAt = DateTime.UtcNow,
            });
            await _db.Users.AddAsync(user);
        }
        else
        {
            user.GoogleSubjectId = googleId;
            user.UpdatedAt = DateTime.UtcNow;

            if (!user.ExternalAccounts.Any(ea => ea.Provider == "Google" && ea.ProviderSubjectId == googleId))
            {
                user.ExternalAccounts.Add(new ExternalAccount
                {
                    Provider = "Google",
                    ProviderSubjectId = googleId,
                    LinkedAt = DateTime.UtcNow,
                });
            }
        }

        await _db.SaveChangesAsync();

        _logger.LogInformation("User {Email} logged in with Google (Subject ID: {GoogleId}).", email, googleId);
        return Redirect(returnUrl);
    }

    [HttpGet("discord-login")]
    public IActionResult DiscordLogin([FromQuery] string returnUrl = "/")
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action(nameof(DiscordCallback), new { returnUrl })
        };
        return Challenge(properties, "Discord");
    }

    [HttpGet("discord-callback")]
    public async Task<IActionResult> DiscordCallback([FromQuery] string returnUrl = "/")
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Discord authentication failed.");
        }

        var claims = authenticateResult.Principal.Identities.FirstOrDefault()?.Claims;
        var discordId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value ?? "Discord User";

        if (string.IsNullOrEmpty(discordId))
        {
            return BadRequest("Required Discord User ID claim was not returned.");
        }

        // Find existing by Discord ID, then by email
        var user = await _db.Users
            .Include(u => u.ExternalAccounts)
            .FirstOrDefaultAsync(u => u.DiscordUserId == discordId || (email != null && u.Email == email));

        if (user == null)
        {
            user = new User
            {
                DisplayName = name,
                Email = email ?? $"{discordId}@discord.fcboostpro.internal",
                DiscordUserId = discordId,
                DiscordTag = name,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            user.ExternalAccounts.Add(new ExternalAccount
            {
                Provider = "Discord",
                ProviderSubjectId = discordId,
                LinkedAt = DateTime.UtcNow,
            });
            await _db.Users.AddAsync(user);
        }
        else
        {
            user.DiscordUserId = discordId;
            user.DiscordTag = name;
            user.UpdatedAt = DateTime.UtcNow;

            if (!user.ExternalAccounts.Any(ea => ea.Provider == "Discord" && ea.ProviderSubjectId == discordId))
            {
                user.ExternalAccounts.Add(new ExternalAccount
                {
                    Provider = "Discord",
                    ProviderSubjectId = discordId,
                    LinkedAt = DateTime.UtcNow,
                });
            }
        }

        await _db.SaveChangesAsync();

        _logger.LogInformation("User {Name} logged in with Discord (ID: {DiscordId}).", name, discordId);
        return Redirect(returnUrl);
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        if (User.Identity?.IsAuthenticated != true)
        {
            return Ok(new { isAuthenticated = false });
        }

        var email = User.FindFirstValue(ClaimTypes.Email);
        var subId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        var dbUser = await _db.Users
            .Include(u => u.ExternalAccounts)
            .FirstOrDefaultAsync(u => u.Email == email || u.GoogleSubjectId == subId || u.DiscordUserId == subId);

        if (dbUser == null)
        {
            return Ok(new { isAuthenticated = false });
        }

        return Ok(new
        {
            isAuthenticated = true,
            userId = dbUser.UserId,
            displayName = dbUser.DisplayName,
            email = dbUser.Email,
            role = dbUser.Role,
            discordUserId = dbUser.DiscordUserId,
            discordTag = dbUser.DiscordTag,
            linkedProviders = dbUser.ExternalAccounts.Select(ea => ea.Provider).ToList()
        });
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(new { message = "Logged out successfully" });
    }
}
