using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TinderApp.Data.Entities.Identity;

namespace TinderApp.Data.Entities.Chat
{
    public class ChatKey
    {

        [Key]
        public Guid ChatRoom { get; set; } = Guid.NewGuid();

        [Required]
        [ForeignKey(nameof(Creator))]
        public int CreatorId { get; set; }
        public UserEntity Creator { get; set; }

        [Required]
        [ForeignKey(nameof(Participant))]
        public int ParticipantId { get; set; }
        public UserEntity Participant { get; set; }

        public virtual ICollection<ChatMessage> ChatMessages { get; set; }
    }
}
