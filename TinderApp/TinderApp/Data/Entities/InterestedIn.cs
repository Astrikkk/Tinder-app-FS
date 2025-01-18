using System.ComponentModel.DataAnnotations;

namespace TinderApp.Data.Entities
{
    public class InterestedIn
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
