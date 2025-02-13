using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data;
using TinderApp.DTOs;
using AutoMapper.QueryableExtensions;
using TinderApp.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var entity = _mapper.Map<UserProfile>(model);
        await _dbContext.Profiles.AddAsync(entity);
        await _dbContext.SaveChangesAsync();

        if (model.Image != null)
        {
            string imageName = $"{Guid.NewGuid()}.jpg";
            var dir = _configuration["ImageDir"];
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

            await using var stream = new FileStream(fileSave, FileMode.Create);
            await model.Image.CopyToAsync(stream);

            var profilePhoto = new ProfilePhoto
            {
                Path = imageName,
                IsPrimary = true,
                ProfileId = entity.Id
            };

            entity.ProfilePhotos.Add(profilePhoto);
            _dbContext.Attach(entity); // Avoid unnecessary updates
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
