using AutoMapper;
using System.ComponentModel.DataAnnotations;

namespace TinderApp.Data.Entities.ProfileProp
{
    public class JobPosition
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        public ICollection<UserProfile> UserProfiles { get; set; }
    }
}
