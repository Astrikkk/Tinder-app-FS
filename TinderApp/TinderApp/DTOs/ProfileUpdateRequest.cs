namespace TinderApp.DTOs
{
    public class ProfileUpdateRequest
    {
        public string Name { get; set; }
        public DateOnly BirthDay { get; set; }
        public int JobPositionId { get; set; }
        public int GenderId { get; set; }
        public int InterestedInId { get; set; }
        public int LookingForId { get; set; }
        public int SexualOrientationId { get; set; }
        public List<IFormFile>? Images { get; set; }
        public List<int>? InterestIds { get; set; }
        public string ProfileDescription { get; set; }
    }
}
