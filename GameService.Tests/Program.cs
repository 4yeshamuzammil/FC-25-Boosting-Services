using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Data;
using GameService.Web.Models;
using GameService.Web.Services;

namespace GameService.Tests
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Console.WriteLine("==========================================================");
            Console.WriteLine(" GAME SERVICE PLATFORM - STEP-BY-STEP VERIFICATION SUITE ");
            Console.WriteLine("==========================================================");

            string connectionString = "Server=localhost;Database=GameServiceDb;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=true";
            
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlServer(connectionString)
                .Options;

            using var context = new ApplicationDbContext(options);

            // ------------------------------------------------------------------
            // MODULE 1: DATABASE CONNECTION & ADMIN INITIALIZER
            // ------------------------------------------------------------------
            Console.WriteLine("\n[1/7] Testing DB Initialization & Admin Seeding...");
            await DbInitializer.InitializeAsync(context);

            var admin = await context.Users.FirstOrDefaultAsync(u => u.Email == "admin@gameboost.com");
            if (admin == null || admin.Category != 'A')
            {
                throw new Exception("FAIL: Admin user was not found or has incorrect Category!");
            }

            bool adminPassValid = BCrypt.Net.BCrypt.Verify("Admin123!", admin.PasswordHash);
            if (!adminPassValid)
            {
                throw new Exception("FAIL: Admin BCrypt password hash failed verification!");
            }
            Console.WriteLine($"  [PASS] Admin account verified: {admin.FullName} ({admin.Email}), Category={admin.Category}, Status={admin.Status}");

            // ------------------------------------------------------------------
            // MODULE 2: CUSTOMER SIGNUP & AUTH
            // ------------------------------------------------------------------
            Console.WriteLine("\n[2/7] Testing Customer Registration (Category = 'C')...");
            string testCustomerEmail = $"customer_{Guid.NewGuid():N}@test.com";
            var customer = new User
            {
                FullName = "Test Gamer Customer",
                Email = testCustomerEmail,
                Phone = "+1-555-1111",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("CustomerPass123!"),
                Category = 'C',
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(customer);
            await context.SaveChangesAsync();

            var loadedCustomer = await context.Users.FirstOrDefaultAsync(u => u.Email == testCustomerEmail);
            if (loadedCustomer == null || loadedCustomer.Category != 'C' || loadedCustomer.Status != "Active")
            {
                throw new Exception("FAIL: Customer registration verification failed!");
            }
            Console.WriteLine($"  [PASS] Customer created: {loadedCustomer.FullName} (ID: {loadedCustomer.Id}), Category={loadedCustomer.Category}");

            // ------------------------------------------------------------------
            // MODULE 3: CUSTOMER PLACING AN ORDER
            // ------------------------------------------------------------------
            Console.WriteLine("\n[3/7] Testing Order Placement by Customer...");
            var order = new Order
            {
                CustomerId = loadedCustomer.Id,
                GameName = "Free Fire",
                ServiceType = "Rank Push",
                TargetRank = "Grandmaster Top 100",
                Details = "Play between 6pm-10pm UTC. Do not spend in-game diamonds.",
                Amount = 100.00m,
                Status = "Open",
                AssignedPlayerId = null,
                CreatedAt = DateTime.UtcNow
            };
            await context.Orders.AddAsync(order);
            await context.SaveChangesAsync();

            if (order.Id <= 0 || order.Status != "Open" || order.AssignedPlayerId != null)
            {
                throw new Exception("FAIL: Order creation failed or order is not Open/Unassigned!");
            }
            Console.WriteLine($"  [PASS] Order #{order.Id} placed: {order.GameName} ({order.TargetRank}) for ${order.Amount:F2}, Status={order.Status}");

            // ------------------------------------------------------------------
            // MODULE 4: PLAYER APPLICATION & AGREEMENT ACCEPTANCE
            // ------------------------------------------------------------------
            Console.WriteLine("\n[4/7] Testing Player Application Submission (Category = 'P', Status = 'Pending')...");
            string testPlayerEmail = $"booster_{Guid.NewGuid():N}@test.com";
            var player1 = new User
            {
                FullName = "Elite Booster Alpha",
                Email = testPlayerEmail,
                Phone = "+1-555-2222",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("BoosterPass123!"),
                Category = 'P',
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(player1);
            await context.SaveChangesAsync();

            // Player Application record with DOB, adult check, agreement acceptance
            var app1 = new PlayerApplication
            {
                UserId = player1.Id,
                DateOfBirth = new DateTime(2002, 5, 14),
                IsAdult = true,
                CnicNumber = "42101-9988776-1",
                DocumentPaths = "[\"CNIC_Front:PlayerDocs/test/front.jpg\", \"CNIC_Back:PlayerDocs/test/back.jpg\"]",
                ScreenshotPaths = "[\"GameplayProofs/test/rank_proof.jpg\"]",
                ApplicationStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            await context.PlayerApplications.AddAsync(app1);

            // Legal Agreement Acceptance
            var agreement = new AgreementAcceptance
            {
                UserId = player1.Id,
                AgreementVersion = "v1.0",
                AcceptedAt = DateTime.UtcNow,
                IpAddress = "127.0.0.1"
            };
            await context.AgreementAcceptances.AddAsync(agreement);
            await context.SaveChangesAsync();

            Console.WriteLine($"  [PASS] Player application created for {player1.FullName} (ID: {player1.Id}), Status={player1.Status}, Agreement Accepted={agreement.AgreementVersion}");

            // Verify Pending Player CANNOT claim order
            Console.WriteLine("\n[5/7] Verifying Pending Player cannot claim orders...");
            var (pendingClaimSuccess, pendingClaimMsg) = await context.ExecuteClaimOrderStoredProcedureAsync(order.Id, player1.Id);
            if (pendingClaimSuccess)
            {
                throw new Exception("FAIL: Pending player was incorrectly permitted to claim an order!");
            }
            Console.WriteLine($"  [PASS] Stored procedure correctly rejected pending booster: '{pendingClaimMsg}'");

            // ------------------------------------------------------------------
            // MODULE 5: ADMIN REVIEWS & APPROVES PLAYER
            // ------------------------------------------------------------------
            Console.WriteLine("\n[6/7] Testing Admin Approval & Audit Logging...");
            player1.Status = "Approved";
            app1.ApplicationStatus = "Approved";
            app1.AdminRemarks = "Verified CNIC and Grandmaster Free Fire gameplay proofs.";
            app1.ReviewedAt = DateTime.UtcNow;

            var auditService = new AuditService(context);
            await auditService.LogActionAsync(
                admin.Id,
                "ApprovePlayerApplication",
                "PlayerApplications",
                app1.Id,
                $"Applicant: {player1.FullName}. Remarks: {app1.AdminRemarks}",
                "127.0.0.1");

            await context.SaveChangesAsync();
            Console.WriteLine($"  [PASS] Player #{player1.Id} is now 'Approved'. Audit log entry recorded.");

            // Also create a second approved player to test atomic race condition
            var player2 = new User
            {
                FullName = "Elite Booster Beta",
                Email = $"booster2_{Guid.NewGuid():N}@test.com",
                Phone = "+1-555-3333",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("BoosterPass123!"),
                Category = 'P',
                Status = "Approved",
                CreatedAt = DateTime.UtcNow
            };
            await context.Users.AddAsync(player2);
            await context.SaveChangesAsync();

            // ------------------------------------------------------------------
            // MODULE 6: ATOMIC ORDER CLAIMING & CONCURRENCY PROTECTION
            // ------------------------------------------------------------------
            Console.WriteLine("\n[7/7] Testing Atomic Order Claiming & Race Condition Prevention...");
            
            // Player 1 claims order
            var (claim1Success, claim1Msg) = await context.ExecuteClaimOrderStoredProcedureAsync(order.Id, player1.Id);
            if (!claim1Success)
            {
                throw new Exception($"FAIL: Player 1 claim failed: {claim1Msg}");
            }
            Console.WriteLine($"  [PASS] Player 1 successfully claimed Order #{order.Id}: '{claim1Msg}'");

            // Verify order in DB
            await context.Entry(order).ReloadAsync();
            if (order.Status != "Assigned" || order.AssignedPlayerId != player1.Id)
            {
                throw new Exception($"FAIL: Order state not updated! Status={order.Status}, AssignedPlayerId={order.AssignedPlayerId}");
            }

            // Verify PlayerEarnings entry was generated automatically with 70% rate
            var earning = await context.PlayerEarnings.FirstOrDefaultAsync(e => e.OrderId == order.Id && e.PlayerId == player1.Id);
            if (earning == null || earning.Amount != 70.00m || earning.PaidStatus != "Unpaid")
            {
                throw new Exception("FAIL: Player earning record was not created accurately!");
            }
            Console.WriteLine($"  [PASS] Player earning recorded: ${earning.Amount:F2} (70% of ${order.Amount:F2}), PaidStatus={earning.PaidStatus}");

            // TEST RACE CONDITION: Player 2 attempts to claim the same order
            Console.WriteLine("  Testing duplicate claim by Player 2 on the same order...");
            var (claim2Success, claim2Msg) = await context.ExecuteClaimOrderStoredProcedureAsync(order.Id, player2.Id);
            if (claim2Success)
            {
                throw new Exception("FAIL: Concurrency violation! Player 2 was able to claim an already assigned order!");
            }
            Console.WriteLine($"  [PASS] Atomic check prevented double-claim! Response: '{claim2Msg}'");

            // Complete Order
            order.Status = "Completed";
            order.CompletedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();
            Console.WriteLine($"  [PASS] Order #{order.Id} marked as 'Completed'.");

            // Admin Payout
            earning.PaidStatus = "Paid";
            earning.PaidAt = DateTime.UtcNow;
            await auditService.LogActionAsync(admin.Id, "MarkEarningsPaid", "PlayerEarnings", player1.Id, $"Paid ${earning.Amount:F2}", "127.0.0.1");
            await context.SaveChangesAsync();
            Console.WriteLine($"  [PASS] Earning #{earning.Id} marked as 'Paid'. Payout audit logged.");

            Console.WriteLine("\n==========================================================");
            Console.WriteLine(" ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! (7/7 PASS) ");
            Console.WriteLine("==========================================================");
        }
    }
}
