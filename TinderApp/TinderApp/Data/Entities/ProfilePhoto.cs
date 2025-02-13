using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TinderApp.Data.Entities
{
    public class ProfilePhoto
    {
        public int Id { get; set; }
        public string Path { get; set; }
        public bool IsPrimary { get; set; }
        public int ProfileId { get; set; }
        public UserProfile Profile { get; set; }
    }
}
