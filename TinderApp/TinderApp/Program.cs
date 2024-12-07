using Microsoft.AspNetCore.Identity;
using TinderApp.Data;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data.Entities;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TinderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


//builder.Services.AddIdentityCore<User>()
//    .AddEntityFrameworkStores<TinderDbContext>()
//    .AddApiEndpoints();

//builder.Services.AddAuthentication().AddBearerToken(IdentityConstants.BearerScheme);
//builder.Services.AddAuthorizationBuilder();


// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app's URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Use CORS policy
app.UseCors("AllowReactApp");

app.MapControllers();

//app.MapIdentityApi<User>();

app.Run();
