using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;
using TinderApp.Constants;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.Data.Entities.Chat;
using TinderApp.Data.Entities.Identity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
namespace TinderApp.Hubs
{

    public interface IChatClient
    {
        public Task ReceiveMessage(string username, string message);
    }
    public class ChatHub : Hub<IChatClient>
    {
        private readonly TinderDbContext _dbContext;
        private readonly UserManager<UserEntity> _userManager;

        public ChatHub(TinderDbContext dbContext, UserManager<UserEntity> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task JoinChat(UserConnection connection)
        {
            var user = await _userManager.FindByNameAsync(connection.UserName);
            if (user == null) return;

            var chatConnection = new ChatConnection
            {
                ConnectionId = Context.ConnectionId,
                UserId = user.Id,
                ChatRoom = connection.ChatRoom
            };

            _dbContext.ChatConnections.Add(chatConnection);
            await _dbContext.SaveChangesAsync();

            await Groups.AddToGroupAsync(Context.ConnectionId, connection.ChatRoom);
            await Clients.Group(connection.ChatRoom).ReceiveMessage("Admin", $"{connection.UserName} приєднався до чату");
        }

        public async Task SendMessage(string message)
        {
            var connection = await _dbContext.ChatConnections
                .FirstOrDefaultAsync(c => c.ConnectionId == Context.ConnectionId);

            if (connection != null)
            {
                await Clients.Group(connection.ChatRoom).ReceiveMessage(connection.User.UserName, message);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var connection = await _dbContext.ChatConnections
                .FirstOrDefaultAsync(c => c.ConnectionId == Context.ConnectionId);

            if (connection != null)
            {
                _dbContext.ChatConnections.Remove(connection);
                await _dbContext.SaveChangesAsync();

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, connection.ChatRoom);
                await Clients.Group(connection.ChatRoom).ReceiveMessage("Admin", $"{connection.User.UserName} вийшов з чату");
            }

            await base.OnDisconnectedAsync(exception);
        }
    }


    public record UserConnection(string UserName, string ChatRoom);
}
