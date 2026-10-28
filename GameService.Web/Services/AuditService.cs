using GameService.Web.Data;
using GameService.Web.Models;

namespace GameService.Web.Services
{
    public class AuditService : IAuditService
    {
        private readonly ApplicationDbContext _context;

        public AuditService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task LogActionAsync(int adminUserId, string action, string targetEntity, int targetId, string? details, string? ipAddress)
        {
            var log = new AuditLog
            {
                AdminUserId = adminUserId,
                Action = action,
                TargetEntity = targetEntity,
                TargetId = targetId,
                Details = details,
                Timestamp = DateTime.UtcNow,
                IpAddress = ipAddress
            };

            await _context.AuditLogs.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
}
