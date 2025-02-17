using Microsoft.AspNetCore.Identity;
using TinderApp.Data.Entities.Identity;

public class UserRoleEntity : IdentityUserRole<int>
{
    public int UserId { get; set; }
    public UserEntity User { get; set; }

    public int RoleId { get; set; }
    public RoleEntity Role { get; set; }
}
