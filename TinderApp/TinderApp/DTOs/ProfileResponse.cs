namespace TinderApp.DTOs
{
    public class ProfileResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateOnly BirthDay { get; set; }
        public string Gender { get; set; }
        public string InterestedIn { get; set; }
        public string LookingFor { get; set; }
        public string SexualOrientation { get; set; }
        public List<string> Photos { get; set; } = new List<string>();
        public List<string> Interests { get; set; } = new List<string>();
    }
}
