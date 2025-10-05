using AutoMapper;
using core.entities.user;
using core.interfaces.user;
using infastructure.data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using presentation.viewmodel.users;

namespace application.services.user;

public class UserService : GenericRepository<Users>, IUserRepository
{
    private readonly IMapper _mapper;
    public UserService(DatabaseContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public string GenerateRandomPassword()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public async Task<string> GetNextUserCode()
    {
        // Get the users with the highest CustomerCode
        var latestUser = await _dbContext.Users
            .OrderByDescending(c => c.UserCode)
            .FirstOrDefaultAsync();

        // If no vehicle exist, start from 1001
        if (latestUser == null || string.IsNullOrWhiteSpace(latestUser.UserCode))
            return "US-1001";

        var numericPart = latestUser.UserCode.Substring(3); //Removing US-

        // Parsing the latest code
        if (int.TryParse(numericPart, out int lastCodeNumber))
        {
            return $"US-{lastCodeNumber + 1}";
        }
        throw new Exception("Invalid User Code format in database.");
    }

    public async Task<List<string>> ValidateUser(string email, int userId, string type)
    {
        var errors = new List<string>();

        if (type == "add")
        {
            if (await _dbContext.Users.AnyAsync(c => c.Email == email && !c.IsDeleted))
                errors.Add("A user with this email already exists.");
        }
        if (type == "update")
        {
            if (await _dbContext.Users.AnyAsync(c => c.Email == email && c.UserID != userId && !c.IsDeleted))
                errors.Add("A user with this email already exists.");
        }
        return errors;
    }

    public async Task<LoginResponseVM> AuthenticateUser(LoginRequestVM model)
    {
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == model.Email && !u.IsDeleted);

        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password. Please try again.");

        if (user.IsActive == false)
            throw new UnauthorizedAccessException("Your account has been blocked. Please contact your administration.");
            
        var hasher = new PasswordHasher<Users>();
        var result = hasher.VerifyHashedPassword(user, user.HashKey, model.Password);

        if (result == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Invalid email or password. Please try again.");

        return new LoginResponseVM
        {
            UserID = user.UserID,
            UserCode = user.UserCode,
            Name = user.Name,
            Email = user.Email,
            Status = user.Status,
            Message = "Login successful"
        };
    }

}