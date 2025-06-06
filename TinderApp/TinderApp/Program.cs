﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
//using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.Data.Entities.Identity;
using TinderApp.Interfaces;
using TinderApp.Services;
using TinderApp.Hubs;
using AutoMapper;
using TinderApp.Mapper;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Database context configuration
builder.Services.AddDbContext<TinderDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity configuration
builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddEntityFrameworkStores<TinderDbContext>()
.AddDefaultTokenProviders();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Register custom services
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAccountsService, AccountsService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IUserStatusService, UserStatusService>();


builder.Services.AddHttpClient<IGoogleAuthService, GoogleAuthService>();


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

// Add Google Authentication
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
//    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
//})
//.AddGoogle(googleOptions =>
//{
//    googleOptions.ClientId = builder.Configuration["Authentication:Google:ClientId"];
//    googleOptions.ClientSecret = builder.Configuration["Authentication:Google:ClientSecret"];
//});

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

app.UseAuthentication(); // Enable authentication
app.UseAuthorization();

app.MapHub<ChatHub>("/Chat"); // SignalR hub mapping
app.MapControllers();


//app.MapGet("/api/account/login/google", ([FromQuery] string returnUrl, LinkGenerator linkGenerator, 
//    SignInManager<UserEntity> signManager, HttpContext context) =>
//{
//    var properties = signManager.ConfigureExternalAuthenticationProperties("Google",
//        linkGenerator.GetPathByName(context, "GoogleLoginCaIIback") + $"?returnUrl={returnUrl}");

//    return Results.Challenge(properties, ["Google"]);

//});


// Configure Swagger for development environment
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

await app.RunAsync();

