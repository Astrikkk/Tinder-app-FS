//using System;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace Data.Entities.User
//{
//    public class ProfilePhoto
//    {
//        public int Id { get; set; }

//        [Required]
//        [MaxLength(255)]
//        [Url(ErrorMessage = "Invalid URL format for the photo path.")]
//        public string Path { get; set; }

//        [Required]
//        [ForeignKey(nameof(User))]
//        public string UserId { get; set; }

//        public virtual User? User { get; set; }


//        // Визначення, чи є фото основним
//        public bool IsPrimary { get; set; } = false;
//    }
//}
