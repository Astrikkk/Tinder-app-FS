namespace TinderApp.DTOs
{
    public class ProfileCreateRequest
    {
        public string Name { get; set; }
        public DateOnly BirthDay { get; set; }
        public int GenderId { get; set; }
        public int InterestedInId { get; set; }
        public int LookingForId { get; set; }
        public int SexualOrientationId { get; set; }

        public List<IFormFile>? Images { get; set; }  // Замість одного Image
        public List<int>? InterestIds { get; set; }
        public int UserId { get; set; }
    }

}
