using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.DTOs;
using AutoMapper.QueryableExtensions;

[Route("api/[controller]")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly TinderDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public ProfileController(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles()
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


    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        var profile = await _dbContext.Profiles
            .Include(p => p.ProfilePhotos)
            .Include(p => p.Interests)
            .FirstOrDefaultAsync(p => p.UserId == id);

        if (profile == null)
            return NotFound(new { Message = $"Profile with ID {id} not found." });

        return Ok(_mapper.Map<ProfileItemDTO>(profile));
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromForm] ProfileCreateRequest model)
    {
        Console.WriteLine($"Received data: {JsonSerializer.Serialize(model)}");

        if (!ModelState.IsValid)
        {
            Console.WriteLine("ModelState errors: " + string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
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

        return Ok(new { ProfileId = entity.Id });
    }

    [HttpPut("like")]
    public async Task<IActionResult> LikeProfile(int likedUserId, int likedByUserId)
    {
        // Log the input IDs for debugging
        _logger.LogInformation($"Liked User ID: {likedUserId}, Liked By User ID: {likedByUserId}");

        // Fetch the profiles
        var likedUser = await _dbContext.Profiles
            .Include(p => p.LikedBy)
            .Include(p => p.Matches)
            .FirstOrDefaultAsync(p => p.Id == likedUserId); // Ensure this is the correct field

        var likingUser = await _dbContext.Profiles
            .Include(p => p.LikedBy)
            .Include(p => p.Matches)
            .FirstOrDefaultAsync(p => p.Id == likedByUserId); // Ensure this is the correct field

        // Validate that both profiles exist
        if (likedUser == null)
            return NotFound(new { Message = $"Profile with ID {likedUserId} not found." });

        if (likingUser == null)
            return NotFound(new { Message = $"Profile with ID {likedByUserId} not found." });

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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id)
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
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }

        _dbContext.Profiles.Remove(entity);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = $"Profile with ID {id} has been deleted." });
    }

    [HttpGet("genders")]
    public async Task<IActionResult> GetGenders()
    {
        var genders = await _dbContext.Genders.ToListAsync();
        return Ok(genders);
    }

    [HttpGet("{userId}/chats")]
    public async Task<IActionResult> GetUserChats(int userId)
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

}
