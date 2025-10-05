using core.entities.user;
using presentation.viewmodel.users;

namespace core.interfaces.user;

public interface IUserRepository : IGenericRepository<Users>
{
    Task<string> GetNextUserCode();
    string GenerateRandomPassword();
    Task<List<string>> ValidateUser(string email, int userId, string type);
    Task<LoginResponseVM> AuthenticateUser(LoginRequestVM model);
}