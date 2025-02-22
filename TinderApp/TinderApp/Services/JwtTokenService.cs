using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TinderApp.Data.Entities.Identity;
using TinderApp.Interfaces;



public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<UserEntity> _userManager;

    public JwtTokenService(IConfiguration configuration, UserManager<UserEntity> userManager)
    {
        _configuration = configuration;
        _userManager = userManager;
    }

    public async Task<string> CreateTokenAsync(UserEntity user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // Конвертація у string
            new Claim(ClaimTypes.Email, user.Email ?? string.Empty), // Уникнення null
            new Claim(ClaimTypes.Name, user.UserName ?? string.Empty)
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role.ToString())));


        var secretKey = _configuration.GetValue<string>("JwtSecretKey");
        if (string.IsNullOrEmpty(secretKey))
            throw new InvalidOperationException("JWT secret key is not configured.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Використовуємо SecurityTokenDescriptor
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims), // ✅ Виправлено
            Expires = DateTime.UtcNow.AddDays(10),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
