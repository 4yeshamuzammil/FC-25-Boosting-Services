using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Models;

namespace GameService.Web.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(ApplicationDbContext context)
        {
            // 1. Seed Default Admin if none exists
            var adminUser = await context.Users.FirstOrDefaultAsync(u => u.Category == 'A');
            if (adminUser == null)
            {
                adminUser = new User
                {
                    FullName = "EA Sports FC Operations Lead",
                    Email = "admin@gameboost.com",
                    Phone = "+1-555-0100",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Category = 'A',
                    Status = "Approved",
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(adminUser);
                await context.SaveChangesAsync();
            }

            // 2. Seed Default Customer if none exists
            var customerUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "customer@gameboost.com");
            if (customerUser == null)
            {
                customerUser = new User
                {
                    FullName = "Alex Mercer (FUT Customer)",
                    Email = "customer@gameboost.com",
                    Phone = "+1-555-0102",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Customer123!"),
                    Category = 'C',
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(customerUser);
                await context.SaveChangesAsync();
            }

            // 3. Seed Default Approved Player if none exists
            var playerUser = await context.Users.FirstOrDefaultAsync(u => u.Email == "player@gameboost.com");
            if (playerUser == null)
            {
                playerUser = new User
                {
                    FullName = "Marco Reus (FC Pro Verified)",
                    Email = "player@gameboost.com",
                    Phone = "+1-555-0103",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Player123!"),
                    Category = 'P',
                    Status = "Approved",
                    CreatedAt = DateTime.UtcNow
                };

                await context.Users.AddAsync(playerUser);
                await context.SaveChangesAsync();

                var playerApp = new PlayerApplication
                {
                    UserId = playerUser.Id,
                    DateOfBirth = new DateTime(2001, 4, 12),
                    IsAdult = true,
                    CnicNumber = "42101-5544332-1",
                    DocumentPaths = "[\"CNIC_Front:PlayerDocs/sample/cnic_front.jpg\",\"CNIC_Back:PlayerDocs/sample/cnic_back.jpg\"]",
                    ScreenshotPaths = "[\"GameplayProofs/sample/fifa_rank1.jpg\",\"GameplayProofs/sample/fifa_elite_div.jpg\"]",
                    ApplicationStatus = "Approved",
                    AdminRemarks = "Verified Rank 1 Weekend League (19-1) pro player.",
                    ReviewedAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow
                };
                await context.PlayerApplications.AddAsync(playerApp);

                var agreement = new AgreementAcceptance
                {
                    UserId = playerUser.Id,
                    AgreementVersion = "v1.0",
                    AcceptedAt = DateTime.UtcNow,
                    IpAddress = "127.0.0.1"
                };
                await context.AgreementAcceptances.AddAsync(agreement);
                await context.SaveChangesAsync();
            }

            // 4. Seed Sample Orders if fewer than 3 orders exist
            if (await context.Orders.CountAsync() < 3)
            {
                var orders = new List<Order>
                {
                    new Order
                    {
                        CustomerId = customerUser.Id,
                        GameName = "EA Sports FC 25",
                        ServiceType = "UT Champions Weekend League",
                        TargetRank = "Rank 1 (19-20 Wins)",
                        Details = "Play 4-3-2-1 formation. Keep all packs unopened in the store.",
                        Amount = 179.99m,
                        Status = "Open",
                        AssignedPlayerId = null,
                        CreatedAt = DateTime.UtcNow.AddHours(-3)
                    },
                    new Order
                    {
                        CustomerId = customerUser.Id,
                        GameName = "EA Sports FC 25",
                        ServiceType = "Division Rivals",
                        TargetRank = "Elite Division Promotion",
                        Details = "PS5 account. Currently Div 2 checkpoint 3. Attacking style direct passing.",
                        Amount = 99.99m,
                        Status = "Open",
                        AssignedPlayerId = null,
                        CreatedAt = DateTime.UtcNow.AddHours(-1)
                    },
                    new Order
                    {
                        CustomerId = customerUser.Id,
                        GameName = "EA Sports FC 25",
                        ServiceType = "UT Champions Play-Offs",
                        TargetRank = "Rank 1 (5-0 Qualifiers)",
                        Details = "Xbox Series X. Play with meta squad, fast completion.",
                        Amount = 39.99m,
                        Status = "Open",
                        AssignedPlayerId = null,
                        CreatedAt = DateTime.UtcNow.AddMinutes(-30)
                    }
                };

                await context.Orders.AddRangeAsync(orders);
                await context.SaveChangesAsync();
            }
        }
    }
}
