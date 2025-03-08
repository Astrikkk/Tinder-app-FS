using Data.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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
        public DateOnly? BirthDay { get; set; }

        [Required]
        [ForeignKey(nameof(Gender))]
        public int GenderId { get; set; }
        public Gender? Gender { get; set; }

        [Required]
        [ForeignKey(nameof(InterestedIn))]
        public int InterestedInId { get; set; }
        public InterestedIn? InterestedIn { get; set; }

        [Required]
        [ForeignKey(nameof(LookingFor))]
        public int LookingForId { get; set; }
        public LookingFor? LookingFor { get; set; }

        [Required]
        [ForeignKey(nameof(SexualOrientation))]
        public int SexualOrientationId { get; set; }
        public SexualOrientation? SexualOrientation { get; set; }

        [Display(Name = "Interests")]
        public virtual ICollection<Interest>? Interests { get; set; } = new List<Interest>();

        [Display(Name = "Profile Photos")]
        public ICollection<ProfilePhoto> ProfilePhotos
        {
            get { return _profilePhotos ??= new List<ProfilePhoto>(); }
            set { _profilePhotos = value; }
        }
        private ICollection<ProfilePhoto> _profilePhotos;

        public UserProfile()
        {
            //ProfilePhotos = new List<ProfilePhoto>(); // Initialize the collection
        }

        public int UserId { get; set; }  // Must be int to match User's Id
        public virtual UserEntity User { get; set; }

        public bool? IsReported { get; set; } = false;
        public virtual ICollection<UserProfile>? Matches { get; set; } = new List<UserProfile> ();
        public virtual ICollection<UserProfile>? LikedBy { get; set; } = new List<UserProfile> ();


    }
}