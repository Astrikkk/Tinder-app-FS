using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TinderApp.DTOs;
using TinderApp.Interfaces;
using TinderApp.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAccountsService _accountsService;

    public AuthController(IAccountsService accountsService)
    {
        _accountsService = accountsService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        try
        {
            await _accountsService.Register(model);
            return Ok(new { Message = "Registration successful!" });
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
            return Ok(new { Token = token }); // Ensures proper casing for JSON response
        }
        catch (Exception ex)
        {
            return Unauthorized(new { Error = ex.Message }); // Changed status code for login errors
        }
    }
}
