using Microsoft.AspNetCore.Identity;
using TinderApp.Data.Entities;
using TinderApp.DTOs;

namespace TinderApp.Services
{
    public interface IAccountsService
    {
        Task Register(RegisterDTO model);
        Task Login(LoginDTO model);
        Task Logout();
    }

    public class AccountsService : IAccountsService
    {
        private readonly UserManager<User> userManager;
        private readonly SignInManager<User> signInManager;

        public AccountsService(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        public async Task Login(LoginDTO model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user == null || !await userManager.CheckPasswordAsync(user, model.Password))
                throw new Exception("Invalid user login or password.");

            await signInManager.SignInAsync(user, true);
        }

        public async Task Logout()
        {
            await signInManager.SignOutAsync();
        }

        public async Task Register(RegisterDTO model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);

            if (user != null)
                throw new Exception("Email is already exists.");

            // create user
            var newUser = new User()
            {
                Email = model.Email,
                UserName = model.Email
            };

            var result = await userManager.CreateAsync(newUser, model.Password);

            if (!result.Succeeded)
                throw new Exception(string.Join(" ", result.Errors.Select(x => x.Description)));
        }
    }
}
