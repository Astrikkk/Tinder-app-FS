using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TinderApp.DTOs;
using TinderApp.Interfaces;
using TinderApp.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAccountsService _accountsService;
    private readonly IUserStatusService _userStatusService;


    public AuthController(IAccountsService accountsService, IUserStatusService userStatusService)
    {
        _accountsService = accountsService;
        _userStatusService = userStatusService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        try
        {
            await _accountsService.Register(model);

            var token = await _accountsService.Login(new LoginDTO { Email = model.Email, Password=model.Password });
            await _userStatusService.SetOnline(model.Email);
            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO model)
    {
        try
        {
            var token = await _accountsService.Login(model);
            await _userStatusService.SetOnline(model.Email);
            return Ok(new { Token = token }); // Ensures proper casing for JSON response
        }
        catch (Exception ex)
        {
            return Unauthorized(new { Error = ex.Message }); // Changed status code for login errors
        }
    }


    [HttpPost("login/google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDTO model)
    {
        try
        {
            var token = await _accountsService.GoogleLoginAsync(model.Token);

            return Ok(new { Token = token });
        }
        catch (Exception ex)
        {
            return Unauthorized(new { Error = ex.Message });
        }
    }

    [HttpPost("offline-status")]
    public async Task<IActionResult> OfflineStatus([FromBody] EmailRequest request)
    {
        try
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { Error = "Email is required." }); // Handle missing email
            }

            await _userStatusService.SetOffline(request.Email);
            return Ok(new { Message = "Offline status successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
    }


    public class EmailRequest
    {
        public string Email { get; set; }
    }




}
