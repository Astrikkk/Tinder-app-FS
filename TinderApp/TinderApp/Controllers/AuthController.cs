using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TinderApp.Data.Entities;
using TinderApp.DTOs;
using TinderApp.Services;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAccountsService accountsService;

    public AuthController(IAccountsService accountsService)
    {
        this.accountsService = accountsService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDTO model)
    {
        try
        {
            await accountsService.Register(model);
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
            var token = await accountsService.Login(model);
            return Ok(new { token });  // Ensure token is returned in the response body
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }





    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await accountsService.Logout();
        return Ok();
    }
}

