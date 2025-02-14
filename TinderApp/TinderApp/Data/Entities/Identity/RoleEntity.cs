using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TinderApp.Data.Entities.Identity
{
    public class RoleEntity : IdentityRole<int>
    {
        public ICollection<UserRoleEntity> UserRoles { get; set; }
    }
}
