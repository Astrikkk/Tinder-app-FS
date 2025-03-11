using System.Collections.Concurrent;
using TinderApp.DTOs;

namespace TinderApp.Services
{
    public class ChatConnectionService
    {
        private readonly ConcurrentDictionary<string, UserConnection> _connections = new();

        public void AddConnection(string connectionId, UserConnection conn) => _connections[connectionId] = conn;
        public bool TryGetConnection(string connectionId, out UserConnection conn) => _connections.TryGetValue(connectionId, out conn);
        public void RemoveConnection(string connectionId) => _connections.TryRemove(connectionId, out _);
    }

}
