using Microsoft.AspNetCore.Identity;
using TinderApp.Data.Entities.Identity;
using TinderApp.DTOs;
using TinderApp.Interfaces;

namespace TinderApp.Services
{
    public class AccountsService : IAccountsService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly SignInManager<UserEntity> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IGoogleAuthService _googleAuthService;

        public AccountsService(UserManager<UserEntity> userManager, SignInManager<UserEntity> signInManager, IJwtTokenService jwtTokenService, IGoogleAuthService googleAuthService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
            _googleAuthService = googleAuthService;
        }

        public async Task<int> Register(RegisterDTO model)
        {
            var user = new UserEntity
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            return user.Id;
        }

        public async Task<string> Login(LoginDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                throw new Exception("Invalid user login or password.");

            //await _signInManager.SignInAsync(user, true);
            return await _jwtTokenService.CreateTokenAsync(user);
        }


        public async Task<string> GoogleLoginAsync(string googleToken)
        {
            var googleUser = await _googleAuthService.ValidateGoogleTokenAsync(googleToken);
            if (googleUser == null)
            {
                throw new Exception("Invalid Google token");
            }

            var user = await _userManager.FindByEmailAsync(googleUser.Email);
            if (user == null)
            {
                user = new UserEntity
                {
                    UserName = googleUser.Email,
                    Email = googleUser.Email
                };
                await _userManager.CreateAsync(user);
            }

            return await _jwtTokenService.CreateTokenAsync(user);
        }



        public async Task Logout()
        {
            await _signInManager.SignOutAsync();
        }
    }
}

