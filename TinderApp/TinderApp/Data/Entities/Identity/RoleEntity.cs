using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace TinderApp.Data.Entities.Identity
{
    public class RoleEntity : IdentityRole<int>
    {
        [Key]
        public override int Id { get; set; }
        public override string Name { get; set; }
        public override string NormalizedName { get; set; }

        public ICollection<UserRoleEntity> UserRoles { get; set; }
    }
}
