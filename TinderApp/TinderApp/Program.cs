using Microsoft.AspNetCore.Identity;
using TinderApp.Data;
using TinderApp.Data.Entities.Identity;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TinderApp.Mapper;
using TinderApp.Interfaces;
using TinderApp.Services;
using TinderApp.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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

// Register UserManager and RoleManager
builder.Services.AddScoped<UserManager<UserEntity>>();
builder.Services.AddScoped<RoleManager<RoleEntity>>();

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register custom services
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAccountsService, AccountsService>();

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// CORS policy to allow React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app's URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Ensure this is included
    });
});

var app = builder.Build();

// Seed roles and initial admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var userManager = services.GetRequiredService<UserManager<UserEntity>>();
        var roleManager = services.GetRequiredService<RoleManager<RoleEntity>>();

        await SeedRolesAndAdminUser(roleManager, userManager);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error occurred seeding the DB: {ex.Message}");
    }
}

app.UseStaticFiles();

// Apply CORS policy
app.UseCors("AllowReactApp"); // CORS must be applied before SignalR

app.UseAuthorization();

app.MapHub<ChatHub>("/chathub"); // Ensure hub mapping is after CORS


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
            Console.WriteLine($"Role '{role}' created.");
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