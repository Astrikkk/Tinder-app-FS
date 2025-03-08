namespace TinderApp.DTOs
{
    public class ProfileDetailsDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateOnly? BirthDay { get; set; }
        public int GenderId { get; set; }
        public string GenderName { get; set; }
        public int InterestedInId { get; set; }
        public string InterestedInName { get; set; }
        public int LookingForId { get; set; }
        public string LookingForName { get; set; }
        public int SexualOrientationId { get; set; }
        public string SexualOrientationName { get; set; }
        public ICollection<string> Interests { get; set; }
        public ICollection<string> ProfilePhotoPaths { get; set; }
        public bool IsReported { get; set; }
        public List<int> LikedByUserIds { get; set; } = new List<int>();
        public List<int> MatchedUserIds { get; set; } = new List<int>();

    }
}
