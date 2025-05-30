﻿using TinderApp.DTOs;
using TinderApp.Data.Entities;
using TinderApp.Services;
using Microsoft.AspNetCore.Mvc;

namespace TinderApp.Interfaces
{
    public interface IProfileService
    {
        Task<List<ProfileItemDTO>> GetAllProfiles();
        Task<ProfileItemDTO?> GetProfile(int id);
        Task<int> CreateProfile(ProfileCreateRequest model);
        Task<bool> LikeProfile(LikeProfileRequest request);
        Task<bool> SuperLikeProfile(LikeProfileRequest request);
        Task<bool> DeleteProfile(int id);
        Task<List<ChatDTO>> GetUserChats(int userId);
        Task<List<ProfileItemDTO>> GetAllReportedProfiles();
        Task<bool> ReportProfile(int profileId);
        Task<List<ProfileItemDTO>> GetFilteredProfiles(int userId);
        Task<List<ProfileItemDTO>> GetProfilesByLookingFor(int id, int userId);
        Task<List<ProfileItemDTO>> GetUserMatchesAsync(int userId);
        Task<List<ProfileItemDTO>> GetUserLikesAsync(int userId);
        Task<List<ProfileItemDTO>> GetUserSuperLikesAsync(int userId); //Зробить
        Task<bool> UpdateSettings(int userId, ProfileSettingsRequest request);
        Task<bool> BlockUser(int ourProfileId, int profileId);
        Task<ProfileUpdateResult> UpdateProfileAsync(int id, ProfileUpdateRequest model);
    }
}
