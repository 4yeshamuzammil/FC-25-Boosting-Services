using System.ComponentModel.DataAnnotations;

namespace GameService.Web.ViewModels.Player
{
    public class JoinTeamViewModel
    {
        [Required(ErrorMessage = "Full Name is required")]
        [StringLength(150, MinimumLength = 3)]
        [Display(Name = "Full Name")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Please enter a valid email address")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Please enter a valid phone number")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirm Password is required")]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match")]
        [Display(Name = "Confirm Password")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date of Birth is required")]
        [DataType(DataType.Date)]
        [Display(Name = "Date of Birth")]
        public DateTime DateOfBirth { get; set; } = DateTime.Today.AddYears(-19);

        // Uploads & Documents
        [Display(Name = "National ID / CNIC Number")]
        [StringLength(50)]
        public string? CnicNumber { get; set; }

        [Display(Name = "CNIC Front Image (Adults)")]
        public IFormFile? CnicFrontFile { get; set; }

        [Display(Name = "CNIC Back Image (Adults)")]
        public IFormFile? CnicBackFile { get; set; }

        [Display(Name = "Supporting Document / Address Proof")]
        public IFormFile? SupportingDocumentFile { get; set; }

        [Display(Name = "Guardian Consent Form / ID (Minors)")]
        public IFormFile? GuardianConsentFile { get; set; }

        [Required(ErrorMessage = "At least one EA Sports FC gameplay or rank proof screenshot is required")]
        [Display(Name = "EA Sports FC 25 Gameplay Proofs (Weekend League Rank 1-3, Elite Division rating, or match records)")]
        public List<IFormFile> GameplayScreenshots { get; set; } = new List<IFormFile>();

        [Range(typeof(bool), "true", "true", ErrorMessage = "You must read and accept the Player Agreement to join our team.")]
        [Display(Name = "I accept the Player Agreement and Terms of Service")]
        public bool AcceptAgreement { get; set; }

        public string AgreementVersion { get; set; } = "v1.0";
    }
}
