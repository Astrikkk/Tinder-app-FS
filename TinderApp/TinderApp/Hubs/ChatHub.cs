using Microsoft.AspNetCore.SignalR;
using TinderApp.Data;
using TinderApp.Data.Entities.Chat;
using TinderApp.DTOs;
using TinderApp.Services;
using Microsoft.EntityFrameworkCore;

namespace TinderApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatConnectionService _chatConnectionService;
        private readonly TinderDbContext _dbContext;

        public ChatHub(ChatConnectionService chatConnectionService, TinderDbContext dbContext)
        {
            _chatConnectionService = chatConnectionService;
            _dbContext = dbContext;
        }

        public async Task CreatePrivateChat(int creatorId, int participantId)
        {
            // Перевіряємо, чи чат між цими користувачами вже існує
            var existingChat = await _dbContext.ChatKeys
                .FirstOrDefaultAsync(c =>
                    (c.CreatorId == creatorId && c.ParticipantId == participantId) ||
                    (c.CreatorId == participantId && c.ParticipantId == creatorId));

            if (existingChat != null)
            {
                await Clients.Caller.SendAsync("ChatAlreadyExists", existingChat.ChatRoom.ToString());
                return;
            }

            // Генеруємо новий GUID для кімнати
            var chatRoomId = Guid.NewGuid();
            var newChat = new ChatKey
            {
                ChatRoom = chatRoomId,
                CreatorId = creatorId,
                ParticipantId = participantId
            };

            _dbContext.ChatKeys.Add(newChat);
            await _dbContext.SaveChangesAsync();

            // Повідомляємо обох користувачів про новий чат
            await Clients.User(creatorId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
            await Clients.User(participantId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            //Console.WriteLine($"User {conn.Username} joining room {conn.ChatRoom}");

            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);
            _chatConnectionService.AddConnection(Context.ConnectionId, conn);

            //await Clients.Group(conn.ChatRoom).SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined {conn.ChatRoom}");
        }


        public async Task SendMessage(string chatRoom, int senderId, string message)
        {
            // Перевіряємо, чи існує чат з таким ChatRoom
            var chatKey = await _dbContext.ChatKeys.FirstOrDefaultAsync(c => c.ChatRoom.ToString() == chatRoom);

            if (chatKey == null)
            {
                await Clients.Caller.SendAsync("Error", "Чат не знайдено.");
                return;
            }

            // Створюємо об'єкт повідомлення
            var chatMessage = new ChatMessage
            {
                Content = message,
                SenderId = senderId,
                ChatKeyId = chatKey.ChatRoom,  // GUID чату
                Readed = false,
                CreatedAt = DateTime.UtcNow
            };

            // Додаємо в базу даних
            _dbContext.ChatMessages.Add(chatMessage);
            await _dbContext.SaveChangesAsync();

            // Надсилаємо повідомлення всім учасникам чату
            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", senderId, message);
        }




        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _chatConnectionService.RemoveConnection(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
