namespace GameService.Web.Services
{
    public interface IAuditService
    {
        Task LogActionAsync(int adminUserId, string action, string targetEntity, int targetId, string? details, string? ipAddress);
    }
}
