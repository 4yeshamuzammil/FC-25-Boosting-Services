using Microsoft.EntityFrameworkCore;
using FCBoosting.Api.Data;
using FCBoosting.Api.Models;

namespace FCBoosting.Api.Services;

public class LocalStorageService : IStorageService
{
    private readonly FCBoostingDbContext _db;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<LocalStorageService> _logger;

    // Allowed content types for proofs
    private static readonly HashSet<string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
        "application/pdf"
    };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB

    public LocalStorageService(FCBoostingDbContext db, IWebHostEnvironment env, ILogger<LocalStorageService> logger)
    {
        _db = db;
        _env = env;
        _logger = logger;
    }

    public async Task<(bool Success, string Message, OrderAttachment? Attachment)> SaveProofAttachmentAsync(
        string orderId,
        string fileName,
        string contentType,
        long fileSize,
        Stream fileStream,
        string uploaderUserId)
    {
        // 1. Validation
        if (!AllowedMimeTypes.Contains(contentType))
        {
            return (false, "Invalid file format. Only PNG, JPG, WEBP, and PDF proof screenshots are allowed.", null);
        }

        if (fileSize > MaxFileSizeBytes || fileSize <= 0)
        {
            return (false, "File size exceeds the 10 MB limit or is empty.", null);
        }

        var order = await _db.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId || o.OrderNumber == orderId);
        if (order == null)
        {
            return (false, "Associated order not found.", null);
        }

        // 2. Secure Directory & Storage Key (Guids prevent predictable file paths or directory traversal)
        var sanitizedExt = Path.GetExtension(fileName);
        var storageKey = $"{Guid.NewGuid():N}{sanitizedExt}";
        var secureDirectory = Path.Combine(_env.ContentRootPath, "SecureStorage", "Proofs", order.OrderId);

        if (!Directory.Exists(secureDirectory))
        {
            Directory.CreateDirectory(secureDirectory);
        }

        var targetPath = Path.Combine(secureDirectory, storageKey);

        // 3. Write file stream to disk
        await using (var destination = new FileStream(targetPath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            await fileStream.CopyToAsync(destination);
        }

        // 4. Save metadata in SQL Server
        var attachment = new OrderAttachment
        {
            OrderId = order.OrderId,
            FileName = Path.GetFileName(fileName),
            StorageKey = targetPath,
            ContentType = contentType,
            FileSize = fileSize,
            UploadedByUserId = uploaderUserId,
            UploadedAt = DateTime.UtcNow,
        };

        await _db.OrderAttachments.AddAsync(attachment);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Secure proof attachment {FileName} saved for Order #{OrderNumber}.", fileName, order.OrderNumber);
        return (true, "Proof attachment uploaded securely.", attachment);
    }

    public async Task<(Stream? Stream, string ContentType, string FileName)> GetAttachmentStreamAsync(string attachmentId)
    {
        var attachment = await _db.OrderAttachments.FindAsync(attachmentId);
        if (attachment == null || !File.Exists(attachment.StorageKey))
        {
            return (null, string.Empty, string.Empty);
        }

        var stream = new FileStream(attachment.StorageKey, FileMode.Open, FileAccess.Read, FileShare.Read);
        return (stream, attachment.ContentType, attachment.FileName);
    }

    public async Task<IEnumerable<OrderAttachment>> GetOrderAttachmentsAsync(string orderId)
    {
        return await _db.OrderAttachments
            .Where(a => a.OrderId == orderId || a.Order!.OrderNumber == orderId)
            .OrderByDescending(a => a.UploadedAt)
            .ToListAsync();
    }
}
