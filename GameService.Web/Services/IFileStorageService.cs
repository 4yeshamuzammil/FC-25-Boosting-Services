namespace GameService.Web.Services
{
    public interface IFileStorageService
    {
        Task<string> SaveSecureFileAsync(IFormFile file, string subFolder);
        (FileStream Stream, string ContentType, string FileName)? GetSecureFile(string relativePath);
        bool IsFileValid(IFormFile file, out string errorMessage);
    }
}
