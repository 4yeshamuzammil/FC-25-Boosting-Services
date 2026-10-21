using FCBoosting.Api.Models;

namespace FCBoosting.Api.Services;

public interface IStorageService
{
    Task<(bool Success, string Message, OrderAttachment? Attachment)> SaveProofAttachmentAsync(
        string orderId,
        string fileName,
        string contentType,
        long fileSize,
        Stream fileStream,
        string uploaderUserId);

    Task<(Stream? Stream, string ContentType, string FileName)> GetAttachmentStreamAsync(string attachmentId);

    Task<IEnumerable<OrderAttachment>> GetOrderAttachmentsAsync(string orderId);
}
