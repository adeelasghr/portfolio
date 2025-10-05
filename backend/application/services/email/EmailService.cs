
using System.Net;
using System.Net.Mail;
using core.interfaces.email;
using Microsoft.Extensions.Options;

public class EmailService : IEmailService
{
    private readonly SmtpOptions _smtp;

    public EmailService(IOptions<SmtpOptions> smtpOptions)
    {
        _smtp = smtpOptions.Value;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var message = new MailMessage(_smtp.FromEmail, to, subject, body)
        {
            IsBodyHtml = true
        };

        using var smtpClient = new SmtpClient(_smtp.Host)
        {
            Port = _smtp.Port,
            Credentials = new NetworkCredential(_smtp.Username, _smtp.Password),
            EnableSsl = _smtp.EnableSsl
        };

        await smtpClient.SendMailAsync(message);
    }
}
