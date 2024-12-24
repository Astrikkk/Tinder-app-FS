using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TinderApp.Data.Entities;


public interface IJwtTokenService
{
    Task<string> CreateTokenAsync(User user);
}
public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<User> _userManager;

    public JwtTokenService(IConfiguration configuration, UserManager<User> userManager)
    {
        _configuration = configuration;
        _userManager = userManager;
    }

    public async Task<string> CreateTokenAsync(User user)
    {
        var claims = new List<Claim>
    {
        new Claim("email", user.Email),
        new Claim("name", user.UserName)
    };

        var roles = await _userManager.GetRolesAsync(user);
        foreach (var role in roles)
            claims.Add(new Claim("roles", role));

        var key = Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JwtSecretKey"));
        var signinKey = new SymmetricSecurityKey(key);
        var signinCredential = new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            signingCredentials: signinCredential,
            expires: DateTime.Now.AddDays(10),
            claims: claims
        );

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);
        Console.WriteLine($"Generated Token: {token}");  // Log the token for debugging
        return token;
    }


}