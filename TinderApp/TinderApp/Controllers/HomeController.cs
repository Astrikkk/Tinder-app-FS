using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data;
using TinderApp.Data.Entities;
using System.Threading.Tasks;

namespace TinderApp.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly TinderDbContext _dbContext;

        public HomeController(UserManager<User> userManager, TinderDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> CreateProfile(string bio, string photoUrl)
        {
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
            {
                return Unauthorized(); 
            }

            if (currentUser.ProfileID != 0)
            {
                return BadRequest("You already have a profile.");
            }

            var profile = new Profile
            {
                Bio = bio,
                PhotoUrl = photoUrl,
                UserId = currentUser.Id
            };

            _dbContext.Profiles.Add(profile);
            await _dbContext.SaveChangesAsync();

            currentUser.ProfileID = profile.Id;
            _dbContext.Users.Update(currentUser);
            await _dbContext.SaveChangesAsync();

            return Ok("Profile created successfully!");
        }
    }
}
