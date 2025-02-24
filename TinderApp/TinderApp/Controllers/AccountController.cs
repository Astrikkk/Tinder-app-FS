using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data.Entities.Identity;
using System.Threading.Tasks;

namespace TinderApp.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly RoleManager<RoleEntity> _roleManager;

        public AccountController(UserManager<UserEntity> userManager, RoleManager<RoleEntity> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // Add a role to a user
        [HttpPost("add-role")]
        public async Task<IActionResult> AddRoleToUser(string username, string role)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return NotFound("User not found.");

            if (!await _roleManager.RoleExistsAsync(role))
                return BadRequest("Role does not exist.");

            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok($"Role '{role}' added to user '{username}'.");
        }

        // Get all roles of a user
        [HttpGet("get-roles/{userId}")]
        public async Task<IActionResult> GetUserRoles(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles);
        }


        // Remove a role from a user
        [HttpPost("remove-role")]
        public async Task<IActionResult> RemoveRoleFromUser(string username, string role)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return NotFound("User not found.");

            var result = await _userManager.RemoveFromRoleAsync(user, role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok($"Role '{role}' removed from user '{username}'.");
        }
    }
}
