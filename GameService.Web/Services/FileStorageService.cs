namespace GameService.Web.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly string _secureBasePath;
        private readonly string[] _allowedExtensions;
        private readonly long _maxFileSizeBytes;

        public FileStorageService(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;

            string configPath = _configuration["StorageSettings:SecureUploadsPath"] ?? "App_Data/SecureUploads";
            // Place outside wwwroot in ContentRootPath
            _secureBasePath = Path.IsPathRooted(configPath)
                ? configPath
                : Path.Combine(_environment.ContentRootPath, configPath);

            if (!Directory.Exists(_secureBasePath))
            {
                Directory.CreateDirectory(_secureBasePath);
            }

            _allowedExtensions = _configuration.GetSection("StorageSettings:AllowedExtensions").Get<string[]>()
                ?? new[] { ".jpg", ".jpeg", ".png", ".webp", ".pdf" };

            _maxFileSizeBytes = _configuration.GetValue<long>("StorageSettings:MaxFileSizeBytes", 5242880); // 5 MB
        }

        public bool IsFileValid(IFormFile file, out string errorMessage)
        {
            errorMessage = string.Empty;

            if (file == null || file.Length == 0)
            {
                errorMessage = "File is empty or not provided.";
                return false;
            }

            if (file.Length > _maxFileSizeBytes)
            {
                errorMessage = $"File size ({file.Length / 1024 / 1024} MB) exceeds maximum allowed limit of {_maxFileSizeBytes / 1024 / 1024} MB.";
                return false;
            }

            string ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_allowedExtensions.Contains(ext))
            {
                errorMessage = $"File extension '{ext}' is not permitted. Allowed extensions: {string.Join(", ", _allowedExtensions)}.";
                return false;
            }

            // Allowed MIME check
            var allowedMimeTypes = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                "image/jpeg",
                "image/png",
                "image/webp",
                "application/pdf"
            };

            if (!allowedMimeTypes.Contains(file.ContentType))
            {
                errorMessage = $"MIME type '{file.ContentType}' is not permitted.";
                return false;
            }

            return true;
        }

        public async Task<string> SaveSecureFileAsync(IFormFile file, string subFolder)
        {
            if (!IsFileValid(file, out string error))
            {
                throw new InvalidOperationException(error);
            }

            string targetFolder = Path.Combine(_secureBasePath, subFolder);
            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }

            string originalExt = Path.GetExtension(file.FileName).ToLowerInvariant();
            string sanitizedBase = Path.GetFileNameWithoutExtension(file.FileName);
            sanitizedBase = string.Concat(sanitizedBase.Split(Path.GetInvalidFileNameChars())).Replace(" ", "_");
            if (sanitizedBase.Length > 20) sanitizedBase = sanitizedBase.Substring(0, 20);

            string safeFileName = $"{Guid.NewGuid():N}_{sanitizedBase}{originalExt}";
            string fullPath = Path.Combine(targetFolder, safeFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return relative path for database storage
            string relativePath = Path.Combine(subFolder, safeFileName).Replace("\\", "/");
            return relativePath;
        }

        public (FileStream Stream, string ContentType, string FileName)? GetSecureFile(string relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
                return null;

            // Sanitize path against directory traversal
            string sanitizedRelative = relativePath.Replace("/", "\\").TrimStart('\\');
            string fullPath = Path.GetFullPath(Path.Combine(_secureBasePath, sanitizedRelative));

            // Security check: ensure path is inside _secureBasePath
            string fullBasePath = Path.GetFullPath(_secureBasePath);
            if (!fullPath.StartsWith(fullBasePath, StringComparison.OrdinalIgnoreCase))
            {
                return null;
            }

            if (!File.Exists(fullPath))
            {
                return null;
            }

            string ext = Path.GetExtension(fullPath).ToLowerInvariant();
            string contentType = ext switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                _ => "application/octet-stream"
            };

            var stream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
            string downloadName = Path.GetFileName(fullPath);

            return (stream, contentType, downloadName);
        }
    }
}
