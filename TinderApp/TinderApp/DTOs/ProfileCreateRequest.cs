namespace TinderApp.DTOs
{
    public class ProfileCreateRequest
    {
        public string Bio { get; set; }
        public IFormFile? Image { get; set; }
    }
}