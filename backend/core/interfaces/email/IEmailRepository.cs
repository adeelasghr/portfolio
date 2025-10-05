namespace core.interfaces.email;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
}
