using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using TinderApp.Data.Entities.Identity;
using TinderApp.Data.Entities.ProfileProp;

public class UserProfile
{
    [Key]
    public int Id { get; set; }

    [Required, StringLength(255)]
    public string Name { get; set; }

    [Required]
    [DataType(DataType.Date)]
    [Display(Name = "Birth Date")]
    public DateOnly BirthDay { get; set; }

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
    public virtual ICollection<UserProfile> LikedUsers { get; set; } = new List<UserProfile>();
    public virtual ICollection<UserProfile> SuperLikedBy { get; set; } = new List<UserProfile>();


    public int? LocationId { get; set; }
    [ForeignKey(nameof(LocationId))]
    public virtual Country? Location { get; set; }

    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }

    public bool? ShowMe { get; set; } = true;

    public virtual ICollection<UserProfile> BlockedUsers { get; set; } = new List<UserProfile>();


    [ForeignKey(nameof(JobPosition))]
    public int? JobPositionId { get; set; }
    public virtual JobPosition? JobPosition { get; set; }
    [MaxLength(500)]
    public string? ProfileDescription { get; set; }
}
