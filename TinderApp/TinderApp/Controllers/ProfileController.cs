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
            var matches = await _profileService.GetUserMatchesAsync(userId);
            if (!matches.Any())
            {
                return NotFound(new { Message = $"No matches found for user with ID {userId}." });
            }
            return Ok(matches);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "An error occurred while fetching user matches.", Details = ex.Message });
        }
    }

    [HttpPut("{userId}/settings")]
    public async Task<IActionResult> UpdateSettings(int userId, [FromBody] ProfileSettingsRequest request)
    {
        var updated = await _profileService.UpdateSettings(userId, request);
        return updated ? Ok("Settings updated successfully.") : NotFound("User profile not found.");
    }

}