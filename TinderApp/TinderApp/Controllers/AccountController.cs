using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data.Entities.Identity;
using TinderApp.DTOs;
using TinderApp.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<IActionResult> AddRoleToUser(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            if (!await _roleManager.RoleExistsAsync(role))
                return BadRequest("Role does not exist.");

            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok($"Role '{role}' added to user '{userId}'.");
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
        public async Task<IActionResult> RemoveRoleFromUser(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found.");

            var result = await _userManager.RemoveFromRoleAsync(user, role);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok($"Role '{role}' removed from user '{userId}'.");
        }

        [HttpGet("get-email/{userId}")]
        public async Task<IActionResult> GetEmailById(int userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());

            if (user == null)
                return NotFound("User not found.");

            var email = await _userManager.GetEmailAsync(user);
            return Ok(email);
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !(await _userManager.IsEmailConfirmedAsync(user)))
            {
                // To prevent email enumeration attacks, return the same response
                return Ok(new { message = "If the email is registered, a reset link will be sent." });
            }

            var code = await _userManager.GeneratePasswordResetTokenAsync(user);
            var callbackUrl = $"{Request.Scheme}://{Request.Host}/reset-password?userId={user.Id}&code={code}";

            var emailService = new EmailService();
            await emailService.SendEmailAsync(model.Email, "Reset Password",
                $"Click the link to reset your password: <a href='{callbackUrl}'>Reset Password</a>");

            return Ok(new { message = "If the email is registered, a reset link will be sent." });
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return BadRequest(new { message = "Invalid reset request." });

            var result = await _userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { message = "Password has been reset successfully." });
        }

    }
}
