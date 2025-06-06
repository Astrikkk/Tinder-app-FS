﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.DTOs;
using TinderApp.Interfaces;
using System.Text.Json;
using TinderApp.Data.Entities.ProfileProp;
using TinderApp.Hubs;
using Microsoft.AspNetCore.SignalR;
using TinderApp.Data.Entities.Chat;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace TinderApp.Services
{
    public class ProfileService : IProfileService
    {
        private readonly TinderDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IHubContext<ChatHub> _chatHub;

        public ProfileService(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration, IHubContext<ChatHub> chatHub)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _configuration = configuration;
            _chatHub = chatHub;

        }

        public async Task<List<ProfileItemDTO>> GetAllProfiles()
        {
            return await _dbContext.Profiles
                .Include(p => p.Interests)
                .Include(p => p.ProfilePhotos)
                .Include(p => p.User)
                    .ThenInclude(u => u.CreatedChats)
                .Include(p => p.User)
                    .ThenInclude(u => u.ParticipatedChats)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<ProfileItemDTO?> GetProfile(int id)
        {
            var profile = await _dbContext.Profiles
                .Include(p => p.ProfilePhotos)
                .Include(p => p.Interests)
                .Include(p => p.User)
                    .ThenInclude(u => u.CreatedChats)
                .Include(p => p.User)
                    .ThenInclude(u => u.ParticipatedChats)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(p => p.userId == id);

            return profile == null ? null : _mapper.Map<ProfileItemDTO>(profile);
        }

        public async Task<int> CreateProfile(ProfileCreateRequest model)
        {
            var entity = _mapper.Map<UserProfile>(model);

            if (model.InterestIds != null && model.InterestIds.Any())
            {
                var interests = await _dbContext.Interests
                    .Where(i => model.InterestIds.Contains(i.Id))
                    .ToListAsync();
                entity.Interests = interests;
            }

            await _dbContext.Profiles.AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            if (model.Images != null && model.Images.Count > 0)
            {
                var dir = _configuration["ImageDir"];

                foreach (var image in model.Images)
                {
                    string imageName = $"{Guid.NewGuid()}.jpg";
                    var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

                    await using var stream = new FileStream(fileSave, FileMode.Create);
                    await image.CopyToAsync(stream);

                    var profilePhoto = new ProfilePhoto
                    {
                        Path = imageName,
                        IsPrimary = entity.ProfilePhotos.Count == 0,
                        ProfileId = entity.Id
                    };

                    entity.ProfilePhotos.Add(profilePhoto);
                }

                _dbContext.Attach(entity);
                await _dbContext.SaveChangesAsync();
            }

            return entity.Id;
        }

        public async Task<bool> LikeProfile(LikeProfileRequest request)
        {
            var likedUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.SuperLikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == request.LikedUserId);

            var likedByUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.SuperLikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == request.LikedByUserId);

            if (likedUser == null || likedByUser == null)
                return false;

            likedUser.LikedBy ??= new List<UserProfile>();
            likedUser.SuperLikedBy ??= new List<UserProfile>();
            likedUser.Matches ??= new List<UserProfile>();

            likedByUser.LikedBy ??= new List<UserProfile>();
            likedByUser.SuperLikedBy ??= new List<UserProfile>();
            likedByUser.Matches ??= new List<UserProfile>();

            bool alreadyLiked = likedUser.LikedBy.Any(u => u.Id == request.LikedByUserId);
            if (!alreadyLiked)
            {
                likedUser.LikedBy.Add(likedByUser);
                likedByUser.LikedUsers.Add(likedUser);
            }

            bool isMatch = likedByUser.LikedBy.Any(u => u.UserId == request.LikedUserId)
                        || likedByUser.SuperLikedBy.Any(u => u.UserId == request.LikedUserId);

            if (isMatch)
            {
                likedUser.Matches.Add(likedByUser);
                likedByUser.Matches.Add(likedUser);

                likedUser.LikedBy.Remove(likedByUser);
                likedByUser.LikedBy.Remove(likedUser);
                likedUser.SuperLikedBy.Remove(likedByUser);
                likedByUser.SuperLikedBy.Remove(likedUser);
                likedUser.LikedUsers.Remove(likedByUser);
                likedByUser.LikedUsers.Remove(likedUser);

                _dbContext.Attach(likedUser);
                _dbContext.Attach(likedByUser);
                await _dbContext.SaveChangesAsync();

                var chatRoomId = Guid.NewGuid();
                var newChat = new ChatKey
                {
                    ChatRoom = chatRoomId,
                    CreatorId = request.LikedByUserId,
                    ParticipantId = request.LikedUserId
                };

                _dbContext.ChatKeys.Add(newChat);
                await _dbContext.SaveChangesAsync();

                await _chatHub.Clients.User(request.LikedByUserId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
                await _chatHub.Clients.User(request.LikedUserId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
            }

            _dbContext.Attach(likedUser);
            _dbContext.Attach(likedByUser);
            await _dbContext.SaveChangesAsync();

            return isMatch;
        }

        public async Task<bool> SuperLikeProfile(LikeProfileRequest request)
        {
            var likedUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.SuperLikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == request.LikedUserId);

            var likedByUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.SuperLikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == request.LikedByUserId);

            if (likedUser == null || likedByUser == null)
                return false;

                likedUser.Matches.Add(likedByUser);
                likedByUser.Matches.Add(likedUser);

                _dbContext.Attach(likedUser);
                _dbContext.Attach(likedByUser);
                await _dbContext.SaveChangesAsync();

                var chatRoomId = Guid.NewGuid();
                var newChat = new ChatKey
                {
                    ChatRoom = chatRoomId,
                    CreatorId = request.LikedByUserId,
                    ParticipantId = request.LikedUserId
                };

                _dbContext.ChatKeys.Add(newChat);
                await _dbContext.SaveChangesAsync();

                await _chatHub.Clients.User(request.LikedByUserId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
                await _chatHub.Clients.User(request.LikedUserId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
            _dbContext.Attach(likedUser);
            _dbContext.Attach(likedByUser);
            await _dbContext.SaveChangesAsync();

            return true;
        }



        public async Task<bool> DeleteProfile(int id)
        {
            var entity = await _dbContext.Profiles
                .Include(p => p.ProfilePhotos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
                return false;

            foreach (var photo in entity.ProfilePhotos)
            {
                var dir = _configuration["ImageDir"];
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), dir, photo.Path);
                if (File.Exists(imagePath))
                    File.Delete(imagePath);
            }

            _dbContext.Profiles.Remove(entity);
            await _dbContext.SaveChangesAsync();

            return true;
        }


        public async Task<List<ChatDTO>> GetUserChats(int userId)
        {
            var user = await _dbContext.Users
                .Include(u => u.CreatedChats)
                .Include(u => u.ParticipatedChats)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return new List<ChatDTO>();

            return user.CreatedChats.Concat(user.ParticipatedChats)
                .Select(chat => new ChatDTO
                {
                    ChatRoom = chat.ChatRoom,
                    CreatorId = chat.CreatorId,
                    ParticipantId = chat.ParticipantId
                })
                .ToList();
        }


        public async Task<List<ProfileItemDTO>> GetAllReportedProfiles()
        {
            return await _dbContext.Profiles
                .Where(p => p.IsReported)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<bool> ReportProfile(int profileId)
        {
            var profile = await _dbContext.Profiles.FindAsync(profileId);
            if (profile == null)
                return false;

            profile.IsReported = true;
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> BlockUser(int ourUserId, int userIdToBlock)
        {
            var ourProfile = await _dbContext.Profiles
                .Include(p => p.BlockedUsers)
                .FirstOrDefaultAsync(p => p.UserId == ourUserId);

            var profileToBlock = await _dbContext.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userIdToBlock);

            if (ourProfile == null || profileToBlock == null)
                return false;

            var chatKey = await _dbContext.ChatKeys
                .FirstOrDefaultAsync(c => (c.CreatorId == ourUserId && c.ParticipantId == userIdToBlock) ||
                                          (c.CreatorId == userIdToBlock && c.ParticipantId == ourUserId));

            if (chatKey != null)
            {
                var messages = await _dbContext.ChatMessages
                    .Where(m => m.ChatKey.ChatRoom == chatKey.ChatRoom)
                    .ToListAsync();

                _dbContext.ChatMessages.RemoveRange(messages);

                _dbContext.ChatKeys.Remove(chatKey);
            }
            if (!ourProfile.BlockedUsers.Contains(profileToBlock))
            {
                ourProfile.BlockedUsers.Add(profileToBlock);
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }


        public async Task<List<ProfileItemDTO>> GetFilteredProfiles(int userId)
        {
            var profile = await _dbContext.Profiles
                .Include(p => p.BlockedUsers)
                .Include(p => p.LikedUsers)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return new List<ProfileItemDTO>();
            }

            var blockedUserIds = profile.BlockedUsers.Select(b => b.UserId).ToList();
            var likedUserIds = profile.LikedUsers.Select(l => l.UserId).ToList();
            var matchedUserIds = profile.Matches.Select(m => m.UserId).ToList();

            // Get the current user object
            var currentUserProfile = await _dbContext.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);

            IQueryable<UserProfile> query = _dbContext.Profiles
                .Include(p => p.Interests)
                .Include(p => p.ProfilePhotos)
                .Where(p =>
                    p.UserId != userId
                    && p.ShowMe == true
                    && !blockedUserIds.Contains(p.UserId)
                    && (currentUserProfile == null || !p.LikedUsers.Contains(currentUserProfile))
                    && !matchedUserIds.Contains(p.UserId)
                    && !p.BlockedUsers.Any(b => b.UserId == profile.UserId)
                );

            if (profile.InterestedInId == 1)
            {
                query = query.Where(p => p.GenderId == 1); // Male
            }
            else if (profile.InterestedInId == 2)
            {
                query = query.Where(p => p.GenderId == 2); // Female
            }

            if (profile.LocationId.HasValue)
            {
                query = query.Where(p => p.LocationId == profile.LocationId);
            }

            var profiles = await query
                .Include(p => p.Gender)
                .Include(p => p.LookingFor)
                .Include(p => p.InterestedIn)
                .Include(p => p.SexualOrientation)
                .Include(p => p.ProfilePhotos)
                .Include(p => p.Interests)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // Filter profiles based on the minimum and maximum age
            var filteredProfiles = profiles
                .Where(p => (!profile.MinAge.HasValue || CalculateAge(p.BirthDay.ToDateTime(TimeOnly.MinValue)) >= profile.MinAge)
                          && (!profile.MaxAge.HasValue || CalculateAge(p.BirthDay.ToDateTime(TimeOnly.MinValue)) <= profile.MaxAge))
                .ToList();

            Console.WriteLine($"Our profile id - {profile.Id} | User id - {profile.UserId}");
            return filteredProfiles;
        }




        private static readonly Dictionary<int, List<int>> lookingForMapping = new()
        {
            { 1, new List<int> { 1, 2, 3 } },
            { 2, new List<int> { 2, 5 } },
            { 3, new List<int> { 4, 5 } },
            { 4, new List<int> { 5, 6 } }
        };



        public async Task<List<ProfileItemDTO>> GetProfilesByLookingFor(int id, int userId)
        {

            var profile = await _dbContext.Profiles
                .Include(p => p.BlockedUsers)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            var blockedUserIds = profile.BlockedUsers.Select(b => b.UserId).ToList();

            IQueryable<UserProfile> query = _dbContext.Profiles
                .Include(p => p.Interests)
                .Include(p => p.ProfilePhotos)
                .Where(p =>
                    p.UserId != userId
                    && p.ShowMe == true
                    && !blockedUserIds.Contains(p.UserId) // Check against in-memory list
                    && !p.BlockedUsers.Any(b => b.UserId == profile.UserId)
                    && !p.LikedBy.Any(l => l.UserId == userId)
                );

            if (profile.InterestedInId == 1)
            {
                query = query.Where(p => p.GenderId == 1);
            }
            else if (profile.InterestedInId == 2)
            {
                query = query.Where(p => p.GenderId == 2);
            }

            var profiles = await query
                .Include(p => p.Gender)
                .Include(p => p.LookingFor)
                .Include(p => p.InterestedIn)
                .Include(p => p.SexualOrientation)
                .Include(p => p.ProfilePhotos)
                .Include(p => p.Interests)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();


            if (!lookingForMapping.ContainsKey(id))
            {
                return new List<ProfileItemDTO>(); // Якщо id не знайдено, повертаємо пустий список
            }

            var lookingForIds = lookingForMapping[id];

            var filteredProfiles = profiles
                .Where(p => lookingForIds.Contains(p.LookingFor.Id)) 
                .ToList();

            return filteredProfiles;
        }




        // Функція підрахунку віку
        private int CalculateAge(DateTime birthDate)
        {
            var today = DateTime.Today;
            int age = today.Year - birthDate.Year;
            if (birthDate.Date > today.AddYears(-age)) age--;
            return age;
        }

        public async Task<List<ProfileItemDTO>> GetUserMatchesAsync(int userId)
        {
            var profile = await _dbContext.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return new List<ProfileItemDTO>();
            }

            var matchesQuery = _dbContext.Profiles
                .Where(p => profile.Matches.Select(m => m.UserId).Contains(p.UserId))
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider);

            return await matchesQuery.ToListAsync();
        }

        public async Task<List<ProfileItemDTO>> GetUserLikesAsync(int userId)
        {
            var profile = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .ThenInclude(m => m.Gender)
                .Include(p => p.LikedBy)
                .ThenInclude(m => m.InterestedIn)
                .Include(p => p.LikedBy)
                .ThenInclude(m => m.LookingFor)
                .Include(p => p.LikedBy)
                .ThenInclude(m => m.SexualOrientation)
                .Include(p => p.LikedBy)
                .ThenInclude(m => m.Interests)
                .Include(p => p.LikedBy)
                .ThenInclude(m => m.ProfilePhotos)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return new List<ProfileItemDTO>();
            }

            var likedByQuery = _dbContext.Profiles
                .Where(p => profile.LikedBy.Select(m => m.UserId).Contains(p.UserId))
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider);

            return await likedByQuery.ToListAsync();
        }



        public async Task<List<ProfileItemDTO>> GetUserSuperLikesAsync(int userId)
        {
            var profile = await _dbContext.Profiles
                .Include(p => p.SuperLikedBy)
                .ThenInclude(m => m.Gender)
                .Include(p => p.SuperLikedBy)
                .ThenInclude(m => m.InterestedIn)
                .Include(p => p.SuperLikedBy)
                .ThenInclude(m => m.LookingFor)
                .Include(p => p.SuperLikedBy)
                .ThenInclude(m => m.SexualOrientation)
                .Include(p => p.SuperLikedBy)
                .ThenInclude(m => m.Interests)
                .Include(p => p.SuperLikedBy)
                .ThenInclude(m => m.ProfilePhotos)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return new List<ProfileItemDTO>();
            }

            var superLikedByQuery = _dbContext.Profiles
                .Where(p => profile.SuperLikedBy.Select(m => m.UserId).Contains(p.UserId))
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider);

            return await superLikedByQuery.ToListAsync();
        }


        public async Task<bool> UpdateSettings(int userId, ProfileSettingsRequest request)
        {
            var profile = await _dbContext.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return false;

            profile.LocationId = request.LocationId;
            profile.MinAge = request.MinAge;
            profile.MaxAge = request.MaxAge;
            profile.ShowMe = request.ShowMe;

            await _dbContext.SaveChangesAsync();
            return true;
        }



        public async Task<ProfileUpdateResult> UpdateProfileAsync(int id, ProfileUpdateRequest model)
        {
            var entity = await _dbContext.Profiles
                .Include(p => p.ProfilePhotos)
                .Include(p => p.Interests)
                .FirstOrDefaultAsync(p => p.UserId == id);

            if (entity == null)
                return new ProfileUpdateResult { ProfileNotFound = true };

            try
            {
                // Оновлюємо тільки обов'язкові поля
                entity.JobPositionId = model.JobPositionId;
                entity.GenderId = model.GenderId;
                entity.InterestedInId = model.InterestedInId;
                entity.LookingForId = model.LookingForId;
                entity.SexualOrientationId = model.SexualOrientationId;

                // Оновлюємо опціональні поля
                if (!string.IsNullOrEmpty(model.ProfileDescription))
                {
                    entity.ProfileDescription = model.ProfileDescription;
                }

                var dir = _configuration["ImageDir"];
                var imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), dir);

                // **Step 1: Remove old photos from database and filesystem**
                if (model.Images != null && model.Images.Count > 0)
                {
                    foreach (var oldPhoto in entity.ProfilePhotos)
                    {
                        var oldFilePath = Path.Combine(imageDirectory, oldPhoto.Path);
                        if (File.Exists(oldFilePath))
                        {
                            File.Delete(oldFilePath); // Remove old image file
                        }
                    }

                    entity.ProfilePhotos.Clear(); // Remove old photos from database
                }

                // **Step 2: Add new photos**
                if (model.Images != null && model.Images.Count > 0)
                {
                    if (!Directory.Exists(imageDirectory))
                        Directory.CreateDirectory(imageDirectory);

                    for (int i = 0; i < model.Images.Count; i++)
                    {
                        var image = model.Images[i];
                        string imageName = $"{Guid.NewGuid()}.jpg";
                        var filePath = Path.Combine(imageDirectory, imageName);

                        await using var stream = new FileStream(filePath, FileMode.Create);
                        await image.CopyToAsync(stream);

                        entity.ProfilePhotos.Add(new ProfilePhoto
                        {
                            Path = imageName,
                            IsPrimary = i == 0, // First image is primary
                            ProfileId = entity.Id
                        });
                    }
                }
                // Update Interests
                if (model.InterestIds != null)
                {
                    entity.Interests.Clear(); // Remove existing interests

                    var interests = await _dbContext.Interests
                        .Where(i => model.InterestIds.Contains(i.Id))
                        .ToListAsync();

                    foreach (var interest in interests)
                    {
                        entity.Interests.Add(interest); // Add new interests one by one
                    }
                }


                await _dbContext.SaveChangesAsync();
                return new ProfileUpdateResult { Success = true };
            }
            catch (Exception ex)
            {
                return new ProfileUpdateResult
                {
                    Success = false,
                    Message = $"Error updating profile: {ex.InnerException?.Message ?? ex.Message}"
                };
            }
        }



    }
}
