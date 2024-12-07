using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data.DTOs;
using TinderApp.Data.Entities;
using TinderApp.Data;

[Route("api/[controller]")]
[ApiController]
public class HomeController : Controller
{
    //private readonly UserManager<User> _userManager;
    private readonly TinderDbContext _dbContext;

    public HomeController(/*UserManager<User> userManager,*/ TinderDbContext dbContext)
    {
        //_userManager = userManager;
        _dbContext = dbContext;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    //[Authorize]
    public async Task<IActionResult> CreateProfile([FromBody] ProfileCreateRequest request)
    {
        //var currentUser = await _userManager.GetUserAsync(User);

        //if (currentUser == null)
        //{
        //    return Unauthorized(new { message = "User is not logged in." });
        //}

        //if (currentUser.ProfileID != 0)
        //{
        //    return BadRequest(new { message = "You already have a profile." });
        //}

        var profile = new Profile
        {
            Bio = request.Bio,
            PhotoUrl = request.PhotoUrl,
            //UserId = currentUser.Id
        };

        _dbContext.Profiles.Add(profile);
        await _dbContext.SaveChangesAsync();

        //currentUser.ProfileID = profile.Id;
        //_dbContext.Users.Update(currentUser);
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
                p.PhotoUrl,
                //UserName = p.User.UserName
            })
            .ToList();

        return Json(profiles);
    }
}
