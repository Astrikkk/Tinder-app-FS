using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.Data.Entities.Identity;
using TinderApp.Interfaces;
using TinderApp.Services;
using TinderApp.Hubs;
using AutoMapper;
using TinderApp.Mapper;


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

// SignalR setup
builder.Services.AddSignalR();
// CORS policy for React app
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("reactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddSingleton<ChatConnectionService>();



builder.Services.AddSwaggerGen(); // Swagger configuration for API docs

var app = builder.Build();

// Seed roles and admin user
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<UserEntity>>();
    var roleManager = services.GetRequiredService<RoleManager<RoleEntity>>();
    await RolesSeeder.SeedRolesAndAdminUser(roleManager, userManager);
}

app.UseStaticFiles();
app.UseCors("reactApp"); // Apply CORS policy

app.UseAuthorization();
app.MapHub<ChatHub>("/Chat"); // SignalR hub mapping
app.MapControllers();

// Configure Swagger for development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await app.RunAsync();

