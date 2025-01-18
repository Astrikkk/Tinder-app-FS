namespace TinderApp.DTOs
{
    public class ProfileItemDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public string Gender { get; set; }
        public string LookingFor { get; set; }
    }
}
