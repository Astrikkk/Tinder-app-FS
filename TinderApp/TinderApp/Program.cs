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
builder.Services.AddAutoMapper(typeof(MappingProfile));

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


var dir = builder.Configuration["ImageDir"];
Console.WriteLine("-------Image dir {0}-------", dir);
var dirPath = Path.Combine(Directory.GetCurrentDirectory(), dir);
if (!Directory.Exists(dirPath))
    Directory.CreateDirectory(dirPath);

//app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dirPath),
    RequestPath = "/images"
});

var imageNo = Path.Combine(dirPath, "noimage.jpg");
if (!File.Exists(imageNo))
{
    string url = "https://m.media-amazon.com/images/I/71QaVHD-ZDL.jpg";
    try
    {
        using (HttpClient client = new HttpClient())
        {
            // Send a GET request to the image URL
            HttpResponseMessage response = client.GetAsync(url).Result;

            // Check if the response status code indicates success (e.g., 200 OK)
            if (response.IsSuccessStatusCode)
            {
                // Read the image bytes from the response content
                byte[] imageBytes = response.Content.ReadAsByteArrayAsync().Result;
                File.WriteAllBytes(imageNo, imageBytes);
            }
            else
            {
                Console.WriteLine($"------Failed to retrieve image. Status code: {response.StatusCode}---------");
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"-----An error occurred: {ex.Message}------");
    }
}

//app.MapIdentityApi<User>();

app.Run();
