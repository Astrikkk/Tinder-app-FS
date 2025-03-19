using Microsoft.AspNetCore.Identity;
using TinderApp.Data.Entities.Chat;

namespace TinderApp.Data.Entities.Identity
{
    public class UserEntity : IdentityUser<int>
    {
        public virtual UserProfile? Profile { get; set; }
        public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
        public virtual ICollection<ChatKey>? CreatedChats { get; set; } = new List<ChatKey>();
        public virtual ICollection<ChatKey>? ParticipatedChats { get; set; } = new List<ChatKey>();
        public virtual ICollection<ChatMessage>? ChatMessages { get; set; }

        public bool IsOnline { get; set; } = false;
    }
}