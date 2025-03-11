//using Microsoft.AspNetCore.SignalR;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace TinderApp.Hubs
//{
//    public class ChatHub : Hub
//    {
//        private static readonly Dictionary<string, string> userRooms = new();

//        public async Task JoinRoom(string user, string room)
//        {
//            if (userRooms.ContainsKey(Context.ConnectionId))
//            {
//                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userRooms[Context.ConnectionId]);
//            }

//            userRooms[Context.ConnectionId] = room;
//            await Groups.AddToGroupAsync(Context.ConnectionId, room);

//            await Clients.Group(room).SendAsync("ReceiveMessage", "System", $"{user} joined the room {room}");
//        }


//        public async Task SendMessage(string user, string room, string message)
//        {
//            Console.WriteLine($"SendMessage called: User={user}, Room={room}, ConnectionId={Context.ConnectionId}");


//            if (userRooms.ContainsKey(Context.ConnectionId) && userRooms[Context.ConnectionId] == room)
//            {
//                await Clients.Group(room).SendAsync("ReceiveMessage", user, message);
//            }
//            else
//            {
//                Console.WriteLine("User is not in the correct room!");
//            }
//        }

//    }

//}
