using TinderApp.DTOs;

namespace TinderApp.Interfaces
{
    public interface IAccountsService
    {
        Task<int> Register(RegisterDTO model);
        Task<string> Login(LoginDTO model);
        Task<string> GoogleLoginAsync(string googleToken);

    }
}
