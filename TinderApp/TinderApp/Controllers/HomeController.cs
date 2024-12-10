using Microsoft.AspNetCore.Mvc;
using TinderApp.Data.DTOs;
using TinderApp.Data.Entities;
using TinderApp.Data;

[Route("api/[controller]")]
[ApiController]
public class HomeController : Controller
{
    private readonly TinderDbContext _dbContext;

    public HomeController(TinderDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromBody] ProfileCreateRequest request)
    {
        var profile = new Profile
        {
            Bio = request.Bio,
            PhotoUrl = request.PhotoUrl,
        };

        _dbContext.Profiles.Add(profile);
        await _dbContext.SaveChangesAsync();

        return Ok(new { message = "Profile created successfully!", profile });
    }

    [HttpGet("profiles")]
    public IActionResult GetAllProfiles()
    {
        var profiles = _dbContext.Profiles
            .Select(p => new
            {
                p.Id,
                p.Bio,
                p.PhotoUrl
            })
            .ToList();

        if (!profiles.Any())
        {
            return NotFound(new { message = "No profiles found in the database." });
        }

        return Json(profiles);
    }
}
