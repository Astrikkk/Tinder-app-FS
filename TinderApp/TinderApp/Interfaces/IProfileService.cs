using TinderApp.DTOs;
using TinderApp.Data.Entities;

namespace TinderApp.Interfaces
{
    public interface IProfileService
    {
        Task<List<ProfileItemDTO>> GetAllProfiles();
        Task<ProfileItemDTO?> GetProfile(int id);
        Task<int> CreateProfile(ProfileCreateRequest model);
        Task<bool> LikeProfile(LikeProfileRequest request);
        Task<bool> DeleteProfile(int id);
        Task<List<ChatDTO>> GetUserChats(int userId);
        Task<List<ProfileItemDTO>> GetAllReportedProfiles();
        Task<bool> ReportProfile(int profileId);
        Task<List<ProfileItemDTO>> GetFilteredProfiles(int userId);
        Task<List<ProfileDetailsDTO>> GetUserMatchesAsync(int userId);
        Task<bool> UpdateSettings(int userId, ProfileSettingsRequest request);
    }
}
