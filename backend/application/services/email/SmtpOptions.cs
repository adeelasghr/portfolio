public sealed class SmtpOptions
{
    public string Host { get; init; } = "";
    public int Port { get; init; } = 587;
    public bool EnableSsl { get; init; } = true;
    public string Username { get; init; } = "";
    public string Password { get; init; } = "";
    public string FromEmail { get; set; } = "";
}