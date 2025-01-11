using Microsoft.AspNetCore.Identity;
using TinderApp.Data;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data.Entities;
using AutoMapper;
using Microsoft.Extensions.FileProviders;
using TinderApp.Mapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database context configuration
builder.Services.AddDbContext<TinderDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS policy to allow React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app's URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// AutoMapper configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

// Apply CORS policy
app.UseCors("AllowReactApp");

app.UseAuthorization();

// Static file configuration
var imageDir = builder.Configuration["ImageDir"] ?? "wwwroot/images/profiles"; // Default directory
var dirPath = Path.Combine(Directory.GetCurrentDirectory(), imageDir);

// Ensure the directory exists
if (!Directory.Exists(dirPath))
{
    Directory.CreateDirectory(dirPath);
    Console.WriteLine($"Directory created at: {dirPath}");
}

// Configure static file serving
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dirPath),
    RequestPath = "/images"
});

// Ensure default image exists
var defaultImagePath = Path.Combine(dirPath, "noimage.jpg");
if (!File.Exists(defaultImagePath))
{
    string defaultImageUrl = "https://m.media-amazon.com/images/I/71QaVHD-ZDL.jpg";
    try
    {
        using HttpClient client = new HttpClient();
        var response = await client.GetAsync(defaultImageUrl);
        if (response.IsSuccessStatusCode)
        {
            var imageBytes = await response.Content.ReadAsByteArrayAsync();
            await File.WriteAllBytesAsync(defaultImagePath, imageBytes);
            Console.WriteLine($"Default image saved at: {defaultImagePath}");
        }
        else
        {
            Console.WriteLine($"Failed to retrieve default image. Status code: {response.StatusCode}");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error fetching default image: {ex.Message}");
    }
}

app.MapControllers();

app.Run();