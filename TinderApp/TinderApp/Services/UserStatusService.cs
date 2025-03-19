using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.Interfaces;

namespace TinderApp.Services
{
    public class UserStatusService : IUserStatusService
    {
        private readonly TinderDbContext _dbContext;

        public UserStatusService(TinderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SetOnline(string email)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                user.IsOnline = true;
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task SetOffline(string email)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user != null)
            {
                user.IsOnline = false;
                await _dbContext.SaveChangesAsync();
            }
        }

    }
}
