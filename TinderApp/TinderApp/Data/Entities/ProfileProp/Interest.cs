using System.Collections.Generic;
using TinderApp.Data.Entities;

namespace TinderApp.Data.Entities.ProfileProp
{
    public class Interest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();
    }
}
