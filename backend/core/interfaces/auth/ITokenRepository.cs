
namespace core.interfaces.auth
{
    public interface ITokenRepository
    {
        string CreateToken(string email, int userId, string role = "Customer");
    }
}
