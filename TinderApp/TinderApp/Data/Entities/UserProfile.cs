using Data.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TinderApp.Data.Entities.Chat;
using TinderApp.Data.Entities.Identity;

namespace TinderApp.Data.Entities
{
    public class UserProfile
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(255)]
        public string Name { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [Display(Name = "Birth Date")]
        public DateOnly BirthDay { get; set; } // Removed nullable since it's required

        [Required]
        [ForeignKey(nameof(Gender))]
        public int GenderId { get; set; }
        public virtual Gender Gender { get; set; }

        [Required]
        [ForeignKey(nameof(InterestedIn))]
        public int InterestedInId { get; set; }
        public virtual InterestedIn InterestedIn { get; set; }

        [Required]
        [ForeignKey(nameof(LookingFor))]
        public int LookingForId { get; set; }
        public virtual LookingFor LookingFor { get; set; }

        [Required]
        [ForeignKey(nameof(SexualOrientation))]
        public int SexualOrientationId { get; set; }
        public virtual SexualOrientation SexualOrientation { get; set; }

        [Display(Name = "Interests")]
        public virtual ICollection<Interest> Interests { get; set; } = new List<Interest>();

        [Display(Name = "Profile Photos")]
        public virtual ICollection<ProfilePhoto> ProfilePhotos { get; set; } = new List<ProfilePhoto>();

        [Required]
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }
        public virtual UserEntity User { get; set; }

        public bool IsReported { get; set; } = false;

        public virtual ICollection<UserProfile> Matches { get; set; } = new List<UserProfile>();
        public virtual ICollection<UserProfile> LikedBy { get; set; } = new List<UserProfile>();
    }
}
