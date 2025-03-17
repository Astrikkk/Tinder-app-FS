namespace TinderApp.DTOs
{
    public class ProfileSettingsRequest
    {
        public int? LocationId { get; set; }
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public bool? ShowMe { get; set; }
    }
}
