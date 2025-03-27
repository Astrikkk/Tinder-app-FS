using System.ComponentModel.DataAnnotations;

namespace TinderApp.DTOs
{
    public class ProfileUpdateRequest
    {

        [Required]
        public int? JobPositionId { get; set; }

        [Required]
        public int GenderId { get; set; }

        [Required]
        public int InterestedInId { get; set; }

        [Required]
        public int LookingForId { get; set; }

        [Required]
        public int SexualOrientationId { get; set; }

        public List<IFormFile>? Images { get; set; }
        public List<int>? InterestIds { get; set; }
        public string? ProfileDescription { get; set; }
    }
}
