using Microsoft.AspNetCore.Identity;
using TinderApp.Data;
using TinderApp.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TinderApp.Mapper;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<TinderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, RoleEntity>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<TinderDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddScoped<UserManager<User>>();
builder.Services.AddScoped<RoleManager<RoleEntity>>();

var app = builder.Build();

// Seed roles and initial admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<RoleEntity>>();

        await SeedRolesAndAdminUser(roleManager, userManager);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred seeding the DB: {ex.Message}");
    }
}



app.UseAuthorization();
app.MapControllers();
await app.RunAsync();

static async Task SeedRolesAndAdminUser(RoleManager<RoleEntity> roleManager, UserManager<User> userManager)
{
    var roles = new[] { "User", "Admin" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new RoleEntity { Name = role, NormalizedName = role.ToUpper() });
            Console.WriteLine($"Role '{role}' created.");
        }
    }

    var adminEmail = "admin@example.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);

    if (adminUser == null)
    {
        adminUser = new User
        {
            UserName = "admin",
            Email = adminEmail,
            EmailConfirmed = true
        };
        var result = await userManager.CreateAsync(adminUser, "Admin123!"); // Use a strong password
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            Console.WriteLine("Admin user created and assigned to 'Admin' role.");
        }
        else
        {
            Console.WriteLine($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
    }
}
