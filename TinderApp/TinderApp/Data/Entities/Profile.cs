using System.ComponentModel.DataAnnotations;

namespace TinderApp.Data.Entities
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }
        [Required, StringLength(255)]
        public string Bio { get; set; }
        [StringLength(255)]
        public string? Image { get; set; }
        //public string UserId { get; set; }
        //public User User { get; set; }
    }
}
