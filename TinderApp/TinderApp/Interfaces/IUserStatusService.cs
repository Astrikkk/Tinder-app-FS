namespace TinderApp.Interfaces
{
    public interface IUserStatusService
    {
        Task SetOnline(string email);
        Task SetOffline(string email);
    }
}
