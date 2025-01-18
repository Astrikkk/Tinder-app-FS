using Microsoft.AspNetCore.Identity;

namespace TinderApp.Data.Entities
{
    public class User : IdentityUser
    {
        public virtual Profile? Profile { get; set; }
    }
}
