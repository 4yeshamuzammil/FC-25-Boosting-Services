using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Database Context (SQL Server)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\MSSQLLocalDB;Database=FCBoostingDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

builder.Services.AddDbContext<FCBoostingDbContext>(options =>
    options.UseSqlServer(connectionString));

// 2. Core Business Services
builder.Services.AddScoped<IOrderLifecycleService, OrderLifecycleService>();
builder.Services.AddScoped<IStorageService, LocalStorageService>();

// 3. Discord Bot Service (Singleton & Hosted Service)
builder.Services.AddSingleton<DiscordBotService>();
builder.Services.AddSingleton<IDiscordBotService>(sp => sp.GetRequiredService<DiscordBotService>());
builder.Services.AddHostedService(sp => sp.GetRequiredService<DiscordBotService>());

// 4. Authentication (Cookies + Google OAuth + Discord OAuth)
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.Name = ".FCBoosting.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.ExpireTimeSpan = TimeSpan.FromDays(30);
    options.SlidingExpiration = true;
})
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["Authentication:Google:ClientId"] ?? "MOCK_GOOGLE_CLIENT_ID";
    options.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"] ?? "MOCK_GOOGLE_SECRET";
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddDiscord(options =>
{
    options.ClientId = builder.Configuration["Authentication:Discord:ClientId"] ?? "MOCK_DISCORD_CLIENT_ID";
    options.ClientSecret = builder.Configuration["Authentication:Discord:ClientSecret"] ?? "MOCK_DISCORD_SECRET";
    options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.Scope.Add("identify");
    options.Scope.Add("email");
    options.Scope.Add("guilds");
});

// 5. CORS Configuration (Allows frontend React app)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Auto-migrate or ensure database exists on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FCBoostingDbContext>();
    try
    {
        db.Database.EnsureCreated();
        app.Logger.LogInformation("SQL Server database connection verified and schema ensured.");
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Could not automatically initialize SQL Server. Database will be connected when available.");
    }
}

app.UseCors("FrontendCorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
