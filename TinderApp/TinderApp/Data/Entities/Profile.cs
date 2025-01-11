using Data.Entities;
using System.ComponentModel.DataAnnotations;

namespace TinderApp.Data.Entities
{
    public class Profile
    {
        [Key]
        public int Id { get; set; }
        [Required, StringLength(255)]
        public string Bio { get; set; }

        
        //[Required]
        //[DataType(DataType.Date)]
        //[Display(Name = "Birth Date")]
        //public DateTime? BirthDay { get; set; }

        //[Required]
        //public Gender Gender { get; set; }

        //[Required]
        //public InterestedIn InterestedIn { get; set; }

        //[Required]
        //public LookingFor LookingFor { get; set; }

        //[Required]
        //public SexualOrientation SexualOrientation { get; set; }

        //[Display(Name = "Interests")]
        //public virtual ICollection<Interest>? Interests { get; set; } = new List<Interest>();

        //[Display(Name = "Profile Photos")]
        public string? Image { get; set; }
    }
}
