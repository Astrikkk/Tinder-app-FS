using AutoMapper;
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
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == request.LikedUserId);

            var likedByUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.UserId == request.LikedByUserId);

            if (likedUser == null || likedByUser == null)
                return false;

             if (likedUser.LikedBy == null)
            {
                likedUser.LikedBy = new List<UserProfile>();
            }
            if (likedByUser.LikedBy == null)
            {
                likedByUser.LikedBy = new List<UserProfile>();
            }
            if (likedUser.Matches == null)
            {
                likedUser.Matches = new List<UserProfile>();
            }
            if (likedByUser.Matches == null)
            {
                likedByUser.Matches = new List<UserProfile>();
            }

            bool alreadyLiked = likedUser.LikedBy.Any(u => u.Id == request.LikedByUserId);
            if (!alreadyLiked)
            {
                likedUser.LikedBy.Add(likedByUser);
            }

            bool isMatch = likedByUser.LikedBy.Any(u => u.UserId == request.LikedUserId);
            if (isMatch)
            {
                likedUser.Matches.Add(likedByUser);
                likedByUser.Matches.Add(likedUser);
                likedUser.LikedBy.Remove(likedByUser);
                likedByUser.LikedBy.Remove(likedUser);

                _dbContext.Attach(likedUser);
                _dbContext.Attach(likedByUser);
                await _dbContext.SaveChangesAsync();

                // Створюємо приватний чат для нового матчу
                var chatRoomId = Guid.NewGuid();
                var newChat = new ChatKey
                {
                    ChatRoom = chatRoomId,
                    CreatorId = request.LikedByUserId,
                    ParticipantId = request.LikedUserId
                };

                _dbContext.ChatKeys.Add(newChat);
                await _dbContext.SaveChangesAsync();

                // Повідомляємо користувачів про створення нового чату через SignalR
                await _chatHub.Clients.User(request.LikedByUserId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
                await _chatHub.Clients.User(request.LikedUserId.ToString()).SendAsync("NewChatCreated", chatRoomId.ToString());
            }

            _dbContext.Attach(likedUser);
            _dbContext.Attach(likedByUser);
            await _dbContext.SaveChangesAsync();

            return isMatch;
        }


        ///////////////////////////////////////////////////////////////Зробить///////////////////////////////////////////////////////////////////////////
        public async Task<bool> SuperLikeProfile(LikeProfileRequest request)
        {
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
            // Fetch current user's profile with BlockedUsers
            var profile = await _dbContext.Profiles
                .Include(p => p.BlockedUsers)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return new List<ProfileItemDTO>();
            }

            // Get IDs of users blocked by the current user
            var blockedUserIds = profile.BlockedUsers.Select(b => b.UserId).ToList();

            IQueryable<UserProfile> query = _dbContext.Profiles
                .Include(p => p.Interests)
                .Include(p => p.ProfilePhotos)
                .Where(p =>
                    p.UserId != userId
                    && p.ShowMe == true
                    && !blockedUserIds.Contains(p.UserId) // Check against in-memory list
                    && !p.BlockedUsers.Any(b => b.UserId == profile.UserId) // Subquery
                );

            // Gender filter
            if (profile.InterestedInId == 1)
            {
                query = query.Where(p => p.GenderId == 1);
            }
            else if (profile.InterestedInId == 2)
            {
                query = query.Where(p => p.GenderId == 2);
            }

            // Location filter
            if (profile.LocationId.HasValue)
            {
                query = query.Where(p => p.LocationId == profile.LocationId);
            }

            // Retrieve profiles and map to DTO
            var profiles = await query
                .Include(p => p.Gender)
                .Include(p => p.LookingFor)
                .Include(p => p.InterestedIn)
                .Include(p => p.SexualOrientation)
                .Include(p => p.ProfilePhotos)
                .Include(p => p.Interests)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            // Age filtering in-memory
            var filteredProfiles = profiles
                .Where(p => (!profile.MinAge.HasValue || CalculateAge(p.BirthDay.ToDateTime(TimeOnly.MinValue)) >= profile.MinAge)
                         && (!profile.MaxAge.HasValue || CalculateAge(p.BirthDay.ToDateTime(TimeOnly.MinValue)) <= profile.MaxAge))
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
    }
}
