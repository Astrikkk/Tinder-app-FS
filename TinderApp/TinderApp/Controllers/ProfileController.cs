using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.DTOs;
using AutoMapper.QueryableExtensions;
using TinderApp.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly TinderDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly IProfileService _profileService;
    public ProfileController(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration, IProfileService profileService)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _configuration = configuration;
        _profileService = profileService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles() => Ok(await _profileService.GetAllProfiles());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        var profile = await _profileService.GetProfile(id);
        return profile != null ? Ok(profile) : NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromForm] ProfileCreateRequest model)
    {
        var profileId = await _profileService.CreateProfile(model);
        return Ok(new { ProfileId = profileId });
    }

    [HttpPut("like")]
    public async Task<IActionResult> LikeProfile([FromBody] LikeProfileRequest request) =>
        Ok(new { IsMatch = await _profileService.LikeProfile(request) });

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id) =>
         Ok(await _profileService.DeleteProfile(id) ? "Profile deleted." : "Profile not found.");

    [HttpGet("{userId}/chats")]
    public async Task<IActionResult> GetUserChats(int userId)
    {
        var chats = await _profileService.GetUserChats(userId);
        return Ok(chats);
    }

    [HttpGet("reported")]
    public async Task<IActionResult> GetAllReportedProfiles()
    {
        try
        {
            var respProf = await _profileService.GetAllReportedProfiles();
            return Ok(respProf);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while fetching reported profiles.", Details = ex.Message });
        }
    }

    [HttpPost("{profileId}/report")]
    public async Task<IActionResult> ReportProfile(int profileId)
    {
        try
        {
            var chats = await _profileService.ReportProfile(profileId);
            return Ok(chats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while reporting the profile.", Details = ex.Message });
        }
    }

    [HttpGet("{id}/profiles")]
    public async Task<IActionResult> GetFilteredProfiles(int id)
    {
        var profiles = await _profileService.GetFilteredProfiles(id);
        return profiles != null ? Ok(profiles) : NotFound();
    }


    [HttpGet("{userId}/matches")]
    public async Task<IActionResult> GetUserMatches(int userId)
    {
        try
        {
            var userProfile = await _dbContext.Profiles
                .Include(p => p.Matches)
                    .ThenInclude(m => m.Gender)
                .Include(p => p.Matches)
                    .ThenInclude(m => m.InterestedIn)
                .Include(p => p.Matches)
                    .ThenInclude(m => m.LookingFor)
                .Include(p => p.Matches)
                    .ThenInclude(m => m.SexualOrientation)
                .Include(p => p.Matches)
                    .ThenInclude(m => m.Interests)
                .Include(p => p.Matches)
                    .ThenInclude(m => m.ProfilePhotos)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (userProfile == null)
            {
                return NotFound(new { Message = $"User with ID {userId} not found." });
            }

            var matches = userProfile.Matches.Select(match => new ProfileDetailsDTO
            {
                Id = match.Id,
                Name = match.Name,
                BirthDay = match.BirthDay,
                GenderId = match.Gender?.Id ?? 0,
                GenderName = match.Gender?.Name,
                InterestedInId = match.InterestedIn?.Id ?? 0,
                InterestedInName = match.InterestedIn?.Name,
                LookingForId = match.LookingFor?.Id ?? 0,
                LookingForName = match.LookingFor?.Name,
                SexualOrientationId = match.SexualOrientation?.Id ?? 0,
                SexualOrientationName = match.SexualOrientation?.Name,
                Interests = match.Interests.Select(i => i.Name).ToList(),
                ProfilePhotoPaths = match.ProfilePhotos.Select(p => p.Path).ToList(),
                IsReported = false,  // Assuming a default value since it's not included in the entity
                LikedByUserIds = new List<int>(), // Adjust this if needed
                MatchedUserIds = new List<int>()  // Adjust this if needed
            }).ToList();

            return Ok(matches);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while fetching user matches.", Details = ex.Message });
        }
    }



}