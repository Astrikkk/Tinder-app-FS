﻿using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data;
using TinderApp.DTOs;
using AutoMapper.QueryableExtensions;
using TinderApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class ProfileController : ControllerBase
{
    private readonly TinderDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public ProfileController(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles()
    {
        var profiles = await _dbContext.Profiles
            .Include(p => p.Interests)
            .Include(p => p.ProfilePhotos)
            .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(profiles);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProfile(int id)
    {
        var profile = await _dbContext.Profiles
            .Include(p => p.ProfilePhotos)
            .Include(p => p.Interests)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (profile == null)
            return NotFound(new { Message = $"Profile with ID {id} not found." });

        return Ok(_mapper.Map<ProfileDetailsDTO>(profile));
    }
[HttpPost]
public async Task<IActionResult> CreateProfile([FromForm] ProfileCreateRequest model)
{
    Console.WriteLine($"Received data: {JsonSerializer.Serialize(model)}");

    if (!ModelState.IsValid)
    {
        Console.WriteLine("ModelState errors: " + string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
        return BadRequest(ModelState);
    }

    var entity = _mapper.Map<UserProfile>(model);

    // Додаємо інтереси, якщо вони вказані
    if (model.InterestIds != null && model.InterestIds.Any())
    {
        var interests = await _dbContext.Interests
            .Where(i => model.InterestIds.Contains(i.Id))
            .ToListAsync();
        entity.Interests = interests; // Призначаємо знайдені інтереси профілю
    }

    await _dbContext.Profiles.AddAsync(entity);
    await _dbContext.SaveChangesAsync();

    // Обробка збереження фотографій
    if (model.Images != null && model.Images.Count > 0)
    {
        var dir = _configuration["ImageDir"];

        foreach (var image in model.Images)
        {
            string imageName = $"{Guid.NewGuid()}.jpg";
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

            await using var stream = new FileStream(fileSave, FileMode.Create);
            await image.CopyToAsync(stream);

            var profilePhoto = new ProfilePhoto
            {
                Path = imageName,
                IsPrimary = entity.ProfilePhotos.Count == 0,
                ProfileId = entity.Id
            };

            entity.ProfilePhotos.Add(profilePhoto);
        }

        _dbContext.Attach(entity);
        await _dbContext.SaveChangesAsync();
    }

    return Ok(new { ProfileId = entity.Id });
}

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromForm] ProfileUpdateRequest model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var entity = await _dbContext.Profiles
            .Include(p => p.ProfilePhotos)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
            return NotFound(new { Message = $"Profile with ID {id} not found." });

        _mapper.Map(model, entity);

        if (model.Image != null)
        {
            string imageName = $"{Guid.NewGuid()}.jpg";
            var dir = _configuration["ImageDir"];
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

            await using var stream = new FileStream(fileSave, FileMode.Create);
            await model.Image.CopyToAsync(stream);

            var existingPrimaryPhoto = entity.ProfilePhotos.FirstOrDefault(p => p.IsPrimary);
            if (existingPrimaryPhoto != null)
                existingPrimaryPhoto.IsPrimary = false;

            entity.ProfilePhotos.Add(new ProfilePhoto
            {
                Path = imageName,
                IsPrimary = true,
                ProfileId = entity.Id
            });
        }

        _dbContext.Attach(entity);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = "Profile updated successfully." });
    }
    [HttpPut("like")]
    public async Task<IActionResult> LikeProfile(int likedUserId, int likedByUserId)
    {
        var likedUser = await _dbContext.Profiles
            .Include(p => p.LikedBy)
            .Include(p => p.Matches)
            .FirstOrDefaultAsync(p => p.Id == likedUserId);

        var likingUser = await _dbContext.Profiles
            .Include(p => p.LikedBy)
            .Include(p => p.Matches)
            .FirstOrDefaultAsync(p => p.Id == likedByUserId);

        if (likedUser == null || likingUser == null)
            return NotFound(new { Message = "One or both profiles not found." });

        if (!likedUser.LikedBy.Contains(likingUser))
        {
            likedUser.LikedBy.Add(likingUser);
        }

        bool isMatch = likingUser.LikedBy.Contains(likedUser);
        if (isMatch)
        {
            likedUser.Matches.Add(likingUser);
            likingUser.Matches.Add(likedUser);

            likedUser.LikedBy.Remove(likingUser); //remove both users from likedBy
            likingUser.LikedBy.Remove(likedUser);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            Message = isMatch ? "It's a match!" : "Profile liked successfully.",
            IsMatch = isMatch
        });
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProfile(int id)
    {
        var entity = await _dbContext.Profiles
            .Include(p => p.ProfilePhotos)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
            return NotFound(new { Message = $"Profile with ID {id} not found." });

        foreach (var photo in entity.ProfilePhotos)
        {
            var dir = _configuration["ImageDir"];
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), dir, photo.Path);
            if (System.IO.File.Exists(imagePath))
                System.IO.File.Delete(imagePath);
        }

        _dbContext.Profiles.Remove(entity);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = $"Profile with ID {id} has been deleted." });
    }

    [HttpGet("genders")]
    public async Task<IActionResult> GetGenders()
    {
        var genders = await _dbContext.Genders.ToListAsync();
        return Ok(genders);
    }
}
