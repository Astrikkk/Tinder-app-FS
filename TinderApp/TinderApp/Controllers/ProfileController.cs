using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.DTOs;
using AutoMapper.QueryableExtensions;
using Microsoft.Extensions.Logging;

[Route("api/[controller]")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly TinderDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<ProfileController> _logger;

    public ProfileController(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration, ILogger<ProfileController> logger)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _configuration = configuration;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles()
    {
        try
        {
            var profiles = await _dbContext.Profiles
                .Include(p => p.Interests)
                .Include(p => p.ProfilePhotos)
                .Include(p => p.User)
                    .ThenInclude(u => u.CreatedChats)
                .Include(p => p.User)
                    .ThenInclude(u => u.ParticipatedChats)
                .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(profiles);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching profiles.");
            return StatusCode(500, new { Message = "An error occurred while fetching profiles.", Details = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        try
        {
            var profile = await _dbContext.Profiles
                .Include(p => p.ProfilePhotos)
                .Include(p => p.Interests)
                .FirstOrDefaultAsync(p => p.UserId == id);

            if (profile == null)
                return NotFound(new { Message = $"Profile with ID {id} not found." });

            return Ok(_mapper.Map<ProfileItemDTO>(profile));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching the profile.");
            return StatusCode(500, new { Message = "An error occurred while fetching the profile.", Details = ex.Message });
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromForm] ProfileCreateRequest model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var entity = _mapper.Map<UserProfile>(model);

            // Assign interests if provided
            if (model.InterestIds != null && model.InterestIds.Any())
            {
                var interests = await _dbContext.Interests
                    .Where(i => model.InterestIds.Contains(i.Id))
                    .ToListAsync();
                entity.Interests = interests;
            }

            await _dbContext.Profiles.AddAsync(entity);
            await _dbContext.SaveChangesAsync();

            // Handle image uploads
            if (model.Images != null && model.Images.Count > 0)
            {
                var dir = _configuration["ImageDir"];

                foreach (var image in model.Images)
                {
                    string imageName = $"{Guid.NewGuid()}.jpg";
                    var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

                    try
                    {
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
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error uploading image.");
                        return StatusCode(500, new { Message = "Error uploading image.", Details = ex.Message });
                    }
                }

                _dbContext.Attach(entity);
                await _dbContext.SaveChangesAsync();
            }

            return Ok(new { ProfileId = entity.Id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while creating the profile.");
            return StatusCode(500, new { Message = "An error occurred while creating the profile.", Details = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromForm] ProfileUpdateRequest model)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var entity = await _dbContext.Profiles
                .Include(p => p.ProfilePhotos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
                return NotFound(new { Message = $"Profile with ID {id} not found." });

            _mapper.Map(model, entity);

            if (model.Image != null)
            {
                string imageName = $"{Guid.NewGuid()}.jpg";
                var dir = _configuration["ImageDir"];
                var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

                try
                {
                    await using var stream = new FileStream(fileSave, FileMode.Create);
                    await model.Image.CopyToAsync(stream);

                    var existingPrimaryPhoto = entity.ProfilePhotos.FirstOrDefault(p => p.IsPrimary);
                    if (existingPrimaryPhoto != null)
                        existingPrimaryPhoto.IsPrimary = false;

                    entity.ProfilePhotos.Add(new ProfilePhoto
                    {
                        Path = imageName,
                        IsPrimary = true,
                        ProfileId = entity.Id
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error uploading image.");
                    return StatusCode(500, new { Message = "Error uploading image.", Details = ex.Message });
                }
            }

            _dbContext.Attach(entity);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Profile updated successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while updating the profile.");
            return StatusCode(500, new { Message = "An error occurred while updating the profile.", Details = ex.Message });
        }
    }

    [HttpPut("like")]
    public async Task<IActionResult> LikeProfile(int likedUserId, int likedByUserId)
    {
        try
        {
            if (likedUserId == likedByUserId)
            {
                return BadRequest(new { Message = "You cannot like yourself." });
            }

            var likedUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.Id == likedUserId);

            var likingUser = await _dbContext.Profiles
                .Include(p => p.LikedBy)
                .Include(p => p.Matches)
                .FirstOrDefaultAsync(p => p.Id == likedByUserId);

            if (likedUser == null || likingUser == null)
                return NotFound(new { Message = "One or both profiles not found." });

            // Check if the likingUser has already liked likedUser
            bool alreadyLiked = likedUser.LikedBy.Any(u => u.Id == likedByUserId);

            if (!alreadyLiked)
            {
                likedUser.LikedBy.Add(likingUser);
            }

            // Check if it's a match
            bool isMatch = likingUser.LikedBy.Any(u => u.Id == likedUserId);

            if (isMatch)
            {
                likedUser.Matches.Add(likingUser);
                likingUser.Matches.Add(likedUser);

                likedUser.LikedBy.Remove(likingUser);
                likingUser.LikedBy.Remove(likedUser);
            }

            await _dbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = isMatch ? "It's a match!" : "Profile liked successfully.",
                IsMatch = isMatch
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while liking the profile.");
            return StatusCode(500, new { Message = "An error occurred while liking the profile.", Details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id)
    {
        try
        {
            var entity = await _dbContext.Profiles
                .Include(p => p.ProfilePhotos)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (entity == null)
                return NotFound(new { Message = $"Profile with ID {id} not found." });

            foreach (var photo in entity.ProfilePhotos)
            {
                var dir = _configuration["ImageDir"];
                var imagePath = Path.Combine(Directory.GetCurrentDirectory(), dir, photo.Path);
                try
                {
                    if (System.IO.File.Exists(imagePath))
                        System.IO.File.Delete(imagePath);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error deleting image.");
                    return StatusCode(500, new { Message = "Error deleting image.", Details = ex.Message });
                }
            }

            _dbContext.Profiles.Remove(entity);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = $"Profile with ID {id} has been deleted." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while deleting the profile.");
            return StatusCode(500, new { Message = "An error occurred while deleting the profile.", Details = ex.Message });
        }
    }

    [HttpGet("genders")]
    public async Task<IActionResult> GetGenders()
    {
        try
        {
            var genders = await _dbContext.Genders.ToListAsync();
            return Ok(genders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching genders.");
            return StatusCode(500, new { Message = "An error occurred while fetching genders.", Details = ex.Message });
        }
    }

    [HttpGet("{userId}/chats")]
    public async Task<IActionResult> GetUserChats(int userId)
    {
        try
        {
            var user = await _dbContext.Users
                .Include(u => u.CreatedChats)
                .Include(u => u.ParticipatedChats)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { Message = $"User with ID {userId} not found." });

            var chats = user.CreatedChats.Concat(user.ParticipatedChats)
                .Select(chat => new
                {
                    chat.ChatRoom,
                    CreatorId = chat.CreatorId,
                    ParticipantId = chat.ParticipantId
                })
                .ToList();

            return Ok(chats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching user chats.");
            return StatusCode(500, new { Message = "An error occurred while fetching user chats.", Details = ex.Message });
        }
    }
}