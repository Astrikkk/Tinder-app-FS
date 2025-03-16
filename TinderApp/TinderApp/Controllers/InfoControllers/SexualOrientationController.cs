using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.Data.Entities.ProfileProp;
using TinderApp.DTOs;

namespace TinderApp.Controllers.InfoControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SexualOrientationController : ControllerBase
    {
        private readonly TinderDbContext _dbContext;

        public SexualOrientationController(TinderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _dbContext.SexualOrientations.ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _dbContext.SexualOrientations.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SexualOrientationDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var newItem = new SexualOrientation { Name = dto.Name };
            _dbContext.SexualOrientations.Add(newItem);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newItem.Id }, newItem);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SexualOrientationDto dto)
        {
            var item = await _dbContext.SexualOrientations.FindAsync(id);
            if (item == null) return NotFound();

            item.Name = dto.Name;
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _dbContext.SexualOrientations.FindAsync(id);
            if (item == null) return NotFound();

            _dbContext.SexualOrientations.Remove(item);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}
