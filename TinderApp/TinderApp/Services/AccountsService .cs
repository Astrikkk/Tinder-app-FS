using Microsoft.AspNetCore.Identity;
using TinderApp.Data.Entities;
using TinderApp.DTOs;

namespace TinderApp.Services
{
    public interface IAccountsService
    {
        Task Register(RegisterDTO model);
        Task<string> Login(LoginDTO model);  // Зміна на Task<string>
        Task Logout();
    }

    public class AccountsService : IAccountsService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;
        private readonly IJwtTokenService jwtTokenService;  // Заміна на IJwtTokenService

        public AccountsService(UserManager<User> userManager, SignInManager<User> signInManager, IJwtTokenService jwtTokenService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.jwtTokenService = jwtTokenService;  // Передача в конструктор
        }

        public async Task<string> Login(LoginDTO model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
                throw new Exception("Invalid user login or password.");

            await signInManager.SignInAsync(user, true);

            // Generate token
            var token = await jwtTokenService.CreateTokenAsync(user);
            return token; // Make sure you're returning the token here
        }


        public async Task Logout()
        {
            await signInManager.SignOutAsync();
        }

        public async Task Register(RegisterDTO model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null)
                throw new Exception("Email already exists.");

            var newUser = new User
            {
                Email = model.Email,
                UserName = model.Email
            };

            var result = await userManager.CreateAsync(newUser, model.Password);
            if (!result.Succeeded)
                throw new Exception(string.Join(" ", result.Errors.Select(e => e.Description)));
        }
    }
}
