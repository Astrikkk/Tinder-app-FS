using Data.Entities;
using TinderApp.Data.Entities;

namespace TinderApp.DTOs
{
    public class ProfileItemDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public LookingFor LookingFor{ get; set; }
        public InterestedIn InterestedIn{ get; set; }  // Add the InterestedIn option
        public SexualOrientation SexualOrientation { get; set; }
        public DateOnly BirthDay { get; set; }  // Add birth date
        public List<Interest> Interests { get; set; } = new List<Interest>();  // Add Interests
        public List<string> Photos { get; set; } = new List<string>();  // Add Photos
        public int userId {  get; set; }
    }
}
