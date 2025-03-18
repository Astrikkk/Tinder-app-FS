using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TinderApp.Data;
using TinderApp.DTOs;

namespace TinderApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly TinderDbContext _dbContext;
        public ChatController(TinderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("{chatKey}")]
        public async Task<IActionResult> GetChatInfoByKey(string chatKey)
        {
            if (!Guid.TryParse(chatKey, out Guid chatRoomId))
            {
                return BadRequest("Невірний формат ключа чату.");
            }

            var chatRoom = await _dbContext.ChatKeys
                .Include(c => c.Creator)
                .Include(c => c.Participant)
                .Include(c => c.ChatMessages)
                .ThenInclude(m => m.Sender)
                .FirstOrDefaultAsync(c => c.ChatRoom == chatRoomId);

            if (chatRoom == null)
            {
                return NotFound("Чат не знайдено.");
            }

            var result = new
            {
                ChatRoom = chatRoom.ChatRoom,
                Creator = new { chatRoom.Creator.Id, chatRoom.Creator.UserName },
                Participant = new { chatRoom.Participant.Id, chatRoom.Participant.UserName },
                Messages = chatRoom.ChatMessages?.Select(m => new
                {
                    m.Id,
                    m.Content,
                    Sender = new { m.Sender.Id, m.Sender.UserName },
                    m.Readed,
                    m.CreatedAt
                }).OrderBy(m => m.CreatedAt)
            };

            return Ok(result);
        }


        [HttpDelete("{chatKey}")]
        public async Task<IActionResult> DeleteChat(string chatKey)
        {
            if (!Guid.TryParse(chatKey, out Guid chatRoomId))
            {
                return BadRequest("Невірний формат ключа чату.");
            }

            var chatRoom = await _dbContext.ChatKeys
                .Include(c => c.ChatMessages)
                .FirstOrDefaultAsync(c => c.ChatRoom == chatRoomId);

            if (chatRoom == null)
            {
                return NotFound("Чат не знайдено.");
            }

            _dbContext.ChatMessages.RemoveRange(chatRoom.ChatMessages);
            _dbContext.ChatKeys.Remove(chatRoom);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Чат видалено успішно." });
        }

        [HttpDelete("{chatKey}/clear")]
        public async Task<IActionResult> ClearChat(string chatKey)
        {
            if (!Guid.TryParse(chatKey, out Guid chatRoomId))
            {
                return BadRequest("Невірний формат ключа чату.");
            }

            var chatRoom = await _dbContext.ChatKeys
                .Include(c => c.ChatMessages)
                .FirstOrDefaultAsync(c => c.ChatRoom == chatRoomId);

            if (chatRoom == null)
            {
                return NotFound("Чат не знайдено.");
            }

            _dbContext.ChatMessages.RemoveRange(chatRoom.ChatMessages);
            await _dbContext.SaveChangesAsync();

            return Ok(new { Message = "Повідомлення у чаті очищено." });
        }


    }
}
