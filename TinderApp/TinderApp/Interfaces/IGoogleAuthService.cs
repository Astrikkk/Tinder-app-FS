using TinderApp.Services;

namespace TinderApp.Interfaces
{
    public interface IGoogleAuthService
    {
        Task<GoogleUserInfo?> ValidateGoogleTokenAsync(string token);

    }
}
