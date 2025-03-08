using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.Data.Entities.Identity;
using TinderApp.Interfaces;
using TinderApp.Services;
using TinderApp.Hubs;
using AutoMapper;
using TinderApp.Mapper; // Ensure you have the correct namespace for MappingProfile

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Database context configuration
builder.Services.AddDbContext<TinderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity configuration
builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<TinderDbContext>()
.AddDefaultTokenProviders();

// Register AutoMapper ✅
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register custom services
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAccountsService, AccountsService>();

// CORS policy for React app
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React frontend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// SignalR setup
builder.Services.AddSignalR();

builder.Services.AddSwaggerGen(); // Swagger configuration for API docs

var app = builder.Build();

// Seed roles and admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<UserEntity>>();
    var roleManager = services.GetRequiredService<RoleManager<RoleEntity>>();
    await SeedRolesAndAdminUser(roleManager, userManager);
}

app.UseStaticFiles();
app.UseCors(); // Apply CORS policy

app.UseAuthorization();
app.MapHub<ChatHub>("/chatHub"); // SignalR hub mapping
app.MapControllers();

// Configure Swagger for development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await app.RunAsync();

// Seed roles and admin user
static async Task SeedRolesAndAdminUser(RoleManager<RoleEntity> roleManager, UserManager<UserEntity> userManager)
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
