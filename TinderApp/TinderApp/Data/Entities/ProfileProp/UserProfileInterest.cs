namespace TinderApp.Data.Entities.ProfileProp
{
    public class UserProfileInterest
    {
        public int UserProfileId { get; set; }
        public UserProfile UserProfile { get; set; }

        public int InterestId { get; set; }
        public Interest Interest { get; set; }
    }
}
