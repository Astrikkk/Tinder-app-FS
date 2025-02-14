using TinderApp.Data.Entities.Identity;

namespace TinderApp.Interfaces
{
    public interface IJwtTokenService
    {
        Task<string> CreateTokenAsync(UserEntity user);
    }
}
