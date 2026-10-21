using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Data;

public class FCBoostingDbContext : DbContext
{
    public FCBoostingDbContext(DbContextOptions<FCBoostingDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<ExternalAccount> ExternalAccounts => Set<ExternalAccount>();
    public DbSet<ServiceEntity> Services => Set<ServiceEntity>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderDetail> OrderDetails => Set<OrderDetail>();
    public DbSet<OrderStatusHistory> OrderStatusHistory => Set<OrderStatusHistory>();
    public DbSet<OrderAttachment> OrderAttachments => Set<OrderAttachment>();
    public DbSet<OrderSessionToken> OrderSessionTokens => Set<OrderSessionToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. User Indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.GoogleSubjectId);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.DiscordUserId);

        // 2. ExternalAccount Indexes
        modelBuilder.Entity<ExternalAccount>()
            .HasIndex(ea => new { ea.Provider, ea.ProviderSubjectId })
            .IsUnique();

        // 3. Order Indexes
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.OrderNumber)
            .IsUnique();

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.WhatsAppReference);

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.Status);

        modelBuilder.Entity<Order>()
            .HasIndex(o => o.CreatedAt);

        // 4. Relationships
        modelBuilder.Entity<Order>()
            .HasMany(o => o.OrderDetails)
            .WithOne(d => d.Order)
            .HasForeignKey(d => d.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.StatusHistory)
            .WithOne(h => h.Order)
            .HasForeignKey(h => h.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.Attachments)
            .WithOne(a => a.Order)
            .HasForeignKey(a => a.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.ExternalAccounts)
            .WithOne(ea => ea.User)
            .HasForeignKey(ea => ea.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
