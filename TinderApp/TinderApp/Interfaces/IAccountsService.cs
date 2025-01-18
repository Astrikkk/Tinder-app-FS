using TinderApp.DTOs;

namespace TinderApp.Interfaces
{
    public interface IAccountsService
    {
        Task Register(RegisterDTO model);
        Task<string> Login(LoginDTO model);
        Task Logout();
    }
}
