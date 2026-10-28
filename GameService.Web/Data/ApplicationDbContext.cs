using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using GameService.Web.Models;
using System.Data;

namespace GameService.Web.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<PlayerApplication> PlayerApplications => Set<PlayerApplication>();
        public DbSet<PlayerEarning> PlayerEarnings => Set<PlayerEarning>();
        public DbSet<AgreementAcceptance> AgreementAcceptances => Set<AgreementAcceptance>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.Category);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasIndex(o => o.Status);
                entity.HasIndex(o => o.CustomerId);
                entity.HasIndex(o => o.AssignedPlayerId);

                entity.HasOne(o => o.Customer)
                    .WithMany(u => u.CustomerOrders)
                    .HasForeignKey(o => o.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.AssignedPlayer)
                    .WithMany(u => u.AssignedOrders)
                    .HasForeignKey(o => o.AssignedPlayerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // PlayerApplication configuration
            modelBuilder.Entity<PlayerApplication>(entity =>
            {
                entity.HasIndex(p => p.UserId);
                entity.HasIndex(p => p.ApplicationStatus);

                entity.HasOne(p => p.User)
                    .WithMany(u => u.Applications)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // PlayerEarning configuration
            modelBuilder.Entity<PlayerEarning>(entity =>
            {
                entity.HasIndex(e => e.PlayerId);
                entity.HasIndex(e => e.OrderId);
                entity.HasIndex(e => e.PaidStatus);

                entity.HasOne(e => e.Player)
                    .WithMany(u => u.Earnings)
                    .HasForeignKey(e => e.PlayerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Order)
                    .WithMany(o => o.Earnings)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // AgreementAcceptance configuration
            modelBuilder.Entity<AgreementAcceptance>(entity =>
            {
                entity.HasIndex(a => a.UserId);

                entity.HasOne(a => a.User)
                    .WithMany(u => u.AgreementAcceptances)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // AuditLog configuration
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasIndex(l => l.Timestamp);
                entity.HasIndex(l => l.AdminUserId);

                entity.HasOne(l => l.AdminUser)
                    .WithMany(u => u.AuditLogs)
                    .HasForeignKey(l => l.AdminUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        /// <summary>
        /// Executes the atomic stored procedure sp_ClaimOrder with concurrency and transaction safety.
        /// </summary>
        public async Task<(bool Success, string Message)> ExecuteClaimOrderStoredProcedureAsync(int orderId, int playerId)
        {
            var successParam = new SqlParameter
            {
                ParameterName = "@Success",
                SqlDbType = SqlDbType.Bit,
                Direction = ParameterDirection.Output
            };

            var messageParam = new SqlParameter
            {
                ParameterName = "@Message",
                SqlDbType = SqlDbType.NVarChar,
                Size = 250,
                Direction = ParameterDirection.Output
            };

            var orderIdParam = new SqlParameter("@OrderId", orderId);
            var playerIdParam = new SqlParameter("@PlayerId", playerId);

            await Database.ExecuteSqlRawAsync(
                "EXEC dbo.sp_ClaimOrder @OrderId, @PlayerId, @Success OUTPUT, @Message OUTPUT",
                orderIdParam, playerIdParam, successParam, messageParam);

            bool success = successParam.Value != DBNull.Value && (bool)successParam.Value;
            string message = messageParam.Value != DBNull.Value ? (string)messageParam.Value : "Unknown response";

            return (success, message);
        }
    }
}
