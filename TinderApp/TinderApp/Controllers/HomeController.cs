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
public class HomeController : ControllerBase
{
    private readonly TinderDbContext _dbContext;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;

    public HomeController(TinderDbContext dbContext, IMapper mapper, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _mapper = mapper;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles()
    {
        var profiles = await _dbContext.Profiles
            .Include(p => p.Interests)  // Include Interests
            .Include(p => p.ProfilePhotos)  // Include Photos
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
        {
            return NotFound(new { Message = $"Profile with ID {id} not found." });
        }
        return Ok(_mapper.Map<ProfileDetailsDTO>(profile));
    }

    [HttpPost]
    public async Task<IActionResult> CreateProfile([FromForm] ProfileCreateRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (_dbContext.Genders == null || !_dbContext.Genders.Any() || !_dbContext.Genders.Any(g => g.Id == model.GenderId) ||
     _dbContext.InterestedInOptions == null || !_dbContext.InterestedInOptions.Any() || !_dbContext.InterestedInOptions.Any(i => i.Id == model.InterestedInId) ||
     _dbContext.LookingForOptions == null || !_dbContext.LookingForOptions.Any() || !_dbContext.LookingForOptions.Any(l => l.Id == model.LookingForId) ||
     _dbContext.SexualOrientations == null || !_dbContext.SexualOrientations.Any() || !_dbContext.SexualOrientations.Any(s => s.Id == model.SexualOrientationId))
        {
            return BadRequest("One or more related entities are invalid.");
        }


        string imageName = string.Empty;

        if (model.Image != null)
        {
            imageName = $"{Guid.NewGuid()}.jpg";
            var dir = _configuration["ImageDir"];
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

            // Ensure this path is valid and accessible
            await using var stream = new FileStream(fileSave, FileMode.Create);
            await model.Image.CopyToAsync(stream);
        }


        var entity = _mapper.Map<TinderApp.Data.Entities.Profile>(model);


        await _dbContext.Profiles.AddAsync(entity);
        await _dbContext.SaveChangesAsync();

        // After profile photo is added
        if (!string.IsNullOrEmpty(imageName))
        {
            var profilePhoto = new ProfilePhoto
            {
                Path = imageName,
                IsPrimary = true,
                ProfileId = entity.Id // Make sure ProfileId is set
            };

            entity.ProfilePhotos.Add(profilePhoto); // Add photo to ProfilePhotos collection
        }

        // Save changes
        _dbContext.Profiles.Update(entity);
        await _dbContext.SaveChangesAsync();





        return Ok(new { ProfileId = entity.Id });
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, [FromForm] ProfileUpdateRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var entity = await _dbContext.Profiles
    .Include(p => p.ProfilePhotos)
    .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
        {
            return NotFound(new { Message = $"Profile with ID {id} not found." });
        }


        _mapper.Map(model, entity);

        if (model.Image != null)
        {
            string imageName = $"{Guid.NewGuid()}.jpg";
            var dir = _configuration["ImageDir"];
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

            await using var stream = new FileStream(fileSave, FileMode.Create);
            await model.Image.CopyToAsync(stream);

            // Ensure that ProfileId is set when adding the new photo
            var existingPrimaryPhoto = entity.ProfilePhotos.FirstOrDefault(p => p.IsPrimary);
            if (existingPrimaryPhoto != null)
            {
                existingPrimaryPhoto.IsPrimary = false;
            }

            // Add the new photo with the correct ProfileId
            entity.ProfilePhotos.Add(new ProfilePhoto
            {
                Path = imageName,
                IsPrimary = true,
                ProfileId = entity.Id  // Ensure ProfileId is set correctly
            });
        }


        _dbContext.Profiles.Update(entity);
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
        {
            return NotFound(new { Message = $"Profile with ID {id} not found." });
        }

        foreach (var photo in entity.ProfilePhotos)
        {
            var dir = _configuration["ImageDir"];
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), dir, photo.Path);
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
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


    [HttpGet("interests")]
    public async Task<IActionResult> GetInterests()
    {
        var interests = await _dbContext.Interests.ToListAsync();
        return Ok(interests);
    }

    [HttpGet("interested-in")]
    public async Task<IActionResult> GetInterestedIn()
    {
        var interestedInOptions = await _dbContext.InterestedInOptions.ToListAsync();
        return Ok(interestedInOptions);
    }

    [HttpGet("looking-for")]
    public async Task<IActionResult> GetLookingFor()
    {
        var lookingForOptions = await _dbContext.LookingForOptions.ToListAsync();
        return Ok(lookingForOptions);
    }

    [HttpGet("sexual-orientation")]
    public async Task<IActionResult> GetSexualOrientation()
    {
        var sexualOrientations = await _dbContext.SexualOrientations.ToListAsync();
        return Ok(sexualOrientations);
    }
}