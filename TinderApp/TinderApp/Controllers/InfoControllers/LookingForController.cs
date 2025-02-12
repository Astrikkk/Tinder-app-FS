using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.Data.Entities;
using TinderApp.DTOs;

namespace TinderApp.Controllers.InfoControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LookingForController : ControllerBase
    {
        private readonly TinderDbContext _dbContext;

        public LookingForController(TinderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _dbContext.LookingForOptions.ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _dbContext.LookingForOptions.FindAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LookingForDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var newItem = new LookingFor { Name = dto.Name };
            _dbContext.LookingForOptions.Add(newItem);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newItem.Id }, newItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] LookingForDto dto)
        {
            var item = await _dbContext.LookingForOptions.FindAsync(id);
            if (item == null) return NotFound();

            item.Name = dto.Name;
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _dbContext.LookingForOptions.FindAsync(id);
            if (item == null) return NotFound();

            _dbContext.LookingForOptions.Remove(item);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }

}
