namespace TinderApp.DTOs
{
    public class ProfileUpdateRequest
    {
        public string Bio { get; set; }
        public IFormFile? Image { get; set; }
    }
}