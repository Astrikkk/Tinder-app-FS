namespace TinderApp.DTOs
{
    public class ProfileUpdateResult
    {
        public bool Success { get; set; }
        public bool ProfileNotFound { get; set; }
        public string Message { get; set; }
    }
}
