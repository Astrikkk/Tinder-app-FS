using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TinderApp.Data.Entities;

namespace Data.Entities
{
    public class Interest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<UserProfile> UserProfiles { get; set; } = new List<UserProfile>();
    }
}
