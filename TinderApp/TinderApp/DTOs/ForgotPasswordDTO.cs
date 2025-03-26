using System.ComponentModel.DataAnnotations;

namespace TinderApp.DTOs
{
    public class ForgotPasswordDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
