using TinderApp;
using Microsoft.AspNetCore.SignalR;
using TinderApp.Data;
using TinderApp.DTOs;
using TinderApp.Services;

namespace TinderApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ChatConnectionService _chatConnectionService;

        public ChatHub(ChatConnectionService chatConnectionService)
        {
            _chatConnectionService = chatConnectionService;
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);
            _chatConnectionService.AddConnection(Context.ConnectionId, conn);

            await Clients.Group(conn.ChatRoom).SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined {conn.ChatRoom}");
        }

        public async Task SendMessage(string msg)
        {
            if (_chatConnectionService.TryGetConnection(Context.ConnectionId, out UserConnection conn))
            {
                await Clients.Group(conn.ChatRoom).SendAsync("ReceiveMessage", conn.Username, msg);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            _chatConnectionService.RemoveConnection(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }

}

