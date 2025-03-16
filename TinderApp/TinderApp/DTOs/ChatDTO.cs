namespace TinderApp.DTOs
{
    public class ChatDTO
    {
        public Guid ChatRoom { get; set; }
        public int CreatorId { get; set; }
        public int ParticipantId { get; set; }
    }
}
