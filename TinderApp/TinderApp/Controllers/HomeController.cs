using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using TinderApp.Data;
using TinderApp.DTOs;
using TinderApp.Data.Entities;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class HomeController(TinderDbContext _dbContext, IMapper _mapper, IConfiguration configuration) : ControllerBase
{

    [HttpGet]
    public async Task<IActionResult> GetAllProfiles()
    {
        var model = await _dbContext.Profiles
            .ProjectTo<ProfileItemDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
        return Ok(model);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TinderApp.Data.Entities.Profile>> GetCategory(int id)
    {
        var category = await _dbContext.Profiles.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return category;
    }

    [HttpPost]
    public async Task<IActionResult> PostCategory([FromForm] ProfileCreateRequest model)
    {
        string imageName = String.Empty;
        if (model.Image != null)
        {
            imageName = Guid.NewGuid().ToString() + ".jpg";
            var dir = configuration["ImageDir"];
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);
            using (var stream = new FileStream(fileSave, FileMode.Create))
                await model.Image.CopyToAsync(stream);
        }
        var entity = _mapper.Map<TinderApp.Data.Entities.Profile>(model);
        entity.Image = imageName;
        _dbContext.Profiles.Add(entity);
        await _dbContext.SaveChangesAsync();
        return Ok(entity.Id);
    }
}
