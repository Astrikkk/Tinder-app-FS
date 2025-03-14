using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TinderApp.Data.Entities.Identity;

namespace TinderApp.Data.Entities.Chat
{
    [Table("tbl_chat_messages")]
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }
        [StringLength(2000)]
        public string Content { get; set; } = string.Empty;

        [ForeignKey("Sender")]
        public int SenderId { get; set; }
        public UserEntity Sender { get; set; }

        
        [ForeignKey("ChatKey")]
        public Guid ChatKeyId { get; set; }
        public ChatKey ChatKey { get; set; }

        public bool Readed { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
