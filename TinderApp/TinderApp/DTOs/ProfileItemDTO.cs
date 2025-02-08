namespace TinderApp.DTOs
{
    public class ProfileItemDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public string Gender { get; set; }
        public string LookingFor { get; set; }
        public string InterestedIn { get; set; }  // Add the InterestedIn option
        public DateOnly BirthDay { get; set; }  // Add birth date
        public List<string> Interests { get; set; } = new List<string>();  // Add Interests
        public List<string> Photos { get; set; } = new List<string>();  // Add Photos
    }
}
