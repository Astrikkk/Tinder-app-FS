using TinderApp.Data.Entities;

namespace TinderApp.Interfaces
{
    public interface IJwtTokenService
    {
        Task<string> CreateTokenAsync(User user);
    }
}
