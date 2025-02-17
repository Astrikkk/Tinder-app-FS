using Microsoft.AspNetCore.Identity;

namespace TinderApp.Data.Entities.Identity
{
    public class UserEntity : IdentityUser<int>
    {
        public virtual UserProfile? Profile { get; set; }
        public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
    }
}