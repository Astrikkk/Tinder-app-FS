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

namespace TinderApp.Services
{
    public class ProfileService : IProfileService
    {
        private readonly TinderDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public ProfileService(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _configuration = configuration;
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
                .FirstOrDefaultAsync(p => p.UserId == id);

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
                .FirstOrDefaultAsync(p => p.Id == request.LikedUserId);

            var likingUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.Id == request.LikedByUserId);

            if (likedUser == null || likingUser == null)
                return false;

            if (!likedUser.LikedBy.Any(u => u.Id == request.LikedByUserId))
                likedUser.LikedBy.Add(likingUser);

            bool isMatch = likingUser.LikedBy.Any(u => u.Id == request.LikedUserId);
            if (isMatch)
            {
                likedUser.Matches.Add(likingUser);
                likingUser.Matches.Add(likedUser);
                likedUser.LikedBy.Remove(likingUser);
                likingUser.LikedBy.Remove(likedUser);
            }

            _dbContext.Attach(likedUser);
            _dbContext.Attach(likingUser);
            await _dbContext.SaveChangesAsync();

            return isMatch;
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

        public async Task<List<ProfileItemDTO>> GetFilteredProfiles(int userId)
        {
            var profile = await _dbContext.Profiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return new List<ProfileItemDTO>();
            }

            IQueryable<UserProfile> query = _dbContext.Profiles
                .Include(p => p.Interests)
                .Include(p => p.ProfilePhotos)
                .Where(p => p.UserId != userId);

            if (profile.InterestedInId == 1)
            {
                query = query.Where(p => p.GenderId == 1);
            }
            else if (profile.InterestedInId == 2)
            {
                query = query.Where(p => p.GenderId == 2);
            }

            var profiles = await query
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return profiles;
        }

    }
}
