using Data.Entities;
using TinderApp.Data.Entities;

namespace TinderApp.DTOs
{

    public class InterestForProfileDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class ProfileItemDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public LookingFor LookingFor{ get; set; }
        public InterestedIn InterestedIn{ get; set; }
        public SexualOrientation SexualOrientation { get; set; }
        public DateOnly BirthDay { get; set; } 
        public List<InterestForProfileDTO> Interests { get; set; } = new List<InterestForProfileDTO>();
        public List<string> Photos { get; set; } = new List<string>(); 
        public int userId {  get; set; }
        public bool IsReported { get; set; }
        public List<int> LikedByUserIds { get; set; } = new List<int>();
        public List<int> MatchedUserIds { get; set; } = new List<int>();


        public List<Guid> CreatedChats { get; set; } = new List<Guid>();
        public List<Guid> ParticipatedChats { get; set; } = new List<Guid>();
    }
}
