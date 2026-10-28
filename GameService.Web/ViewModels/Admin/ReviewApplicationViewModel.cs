using GameService.Web.Models;

namespace GameService.Web.ViewModels.Admin
{
    public class ReviewApplicationViewModel
    {
        public PlayerApplication Application { get; set; } = null!;
        public User Applicant { get; set; } = null!;
        public string? AdminRemarks { get; set; }
        public string Decision { get; set; } = "Approve"; // "Approve" or "Reject"
    }
}
