using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;


namespace TinderApp.Services
{
    public class EmailService
    {
        private readonly string _smtpServer = "smtp.example.com";
        private readonly int _smtpPort = 587; 
        private readonly string _emailSender = "your-email@example.com";
        private readonly string _emailPassword = "your-email-password";

        public async Task SendEmailAsync(string email, string subject, string message)
        {
            using var client = new SmtpClient(_smtpServer, _smtpPort)
            {
                Credentials = new NetworkCredential(_emailSender, _emailPassword),
                EnableSsl = true
            };

            var mailMessage = new MailMessage(_emailSender, email, subject, message)
            {
                IsBodyHtml = true
            };

            await client.SendMailAsync(mailMessage);
        }
    }
}
