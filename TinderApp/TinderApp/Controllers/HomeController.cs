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

    [HttpPut("{id}")]
    public async Task<IActionResult> Edit(int id, [FromForm] ProfileUpdateRequest model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var entity = await _dbContext.Profiles.FindAsync(id);
        if (entity == null)
        {
            return NotFound(new { Message = $"Profile with ID {id} not found." });
        }

        _mapper.Map(model, entity);

        // Оновлення зображення
        if (model.Image != null)
        {
            string imageName = Guid.NewGuid().ToString() + ".jpg";
            var dir = configuration["ImageDir"];
            var fileSave = Path.Combine(Directory.GetCurrentDirectory(), dir, imageName);

            using (var stream = new FileStream(fileSave, FileMode.Create))
            {
                await model.Image.CopyToAsync(stream);
            }

            // Оновлюємо поле зображення
            entity.Image = imageName;
        }

        _dbContext.Profiles.Update(entity);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = "Profile updated successfully." });
    }




    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await _dbContext.Profiles.FindAsync(id);
        if (entity == null)
        {
            return NotFound(new { Message = $"Profile with ID {id} not found." });
        }

        if (!string.IsNullOrEmpty(entity.Image))
        {
            var dir = configuration["ImageDir"];
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), dir, entity.Image);

            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }

        _dbContext.Profiles.Remove(entity);
        await _dbContext.SaveChangesAsync();

        return Ok(new { Message = $"Profile with ID {id} has been deleted." });
    }


}
