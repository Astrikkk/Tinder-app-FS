using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TinderApp.Data.Entities.Identity;

namespace TinderApp.Data.Entities.Chat
{
    public class ChatConnection
    {
        [Key]
        public string ConnectionId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public UserEntity User { get; set; }

        public string ChatRoom { get; set; }
    }
}
