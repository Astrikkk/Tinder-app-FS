using Microsoft.AspNetCore.Identity;
using TinderApp.Data.Entities.Identity;

namespace TinderApp.Services
{
    public static class RolesSeeder
    {
        public static async Task SeedRolesAndAdminUser(RoleManager<RoleEntity> roleManager, UserManager<UserEntity> userManager)
        {
            var roles = new[] { "User", "Admin" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new RoleEntity { Name = role });
                }
            }

            var adminEmail = "admin@example.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new UserEntity
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }

}
