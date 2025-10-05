using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using core.entities.user;
using core.interfaces;
using core.interfaces.email;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using presentation.viewmodel.users;

namespace api.controllers.user;

[ApiController]
[Route("api/[controller]")]
public class UserController : BaseController
{
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;
    public UserController(IMapper mapper, IUnitOfWork unitOfWork, IEmailService emailService, IConfiguration config) : base(mapper, unitOfWork)
    {
        _emailService = emailService;
        _config = config;
    }

    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _unitofwork.Repository<Users>().GetAll().ToListAsync();
        return Ok(users);
    }

    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _unitofwork.Repository<Users>().GetById(id));
    }

    [HttpGet]
    [Route("GetNewCode")]
    public async Task<IActionResult> GetNewCode()
    {
        string newCode = await _unitofwork.Users().GetNextUserCode();
        return Ok(newCode);
    }

    [HttpPost]
    [Route("AddUser")]
    public async Task<IActionResult> AddUser([FromForm] Users model)
    {
        string tempPassword;
        if (string.IsNullOrEmpty(model.Email))
        {
            return BadRequest(new { Errors = new List<string> { "Email is required." } });
        }
        var validationErrors = await _unitofwork.Users().ValidateUser(model.Email, 0, "add");
        if (validationErrors.Any())
        {
            return BadRequest(new { Errors = validationErrors });
        }

        model.UserCode = await _unitofwork.Users().GetNextUserCode();
        model.Status = "Active";

        //Setting up Password
        tempPassword = _unitofwork.Users().GenerateRandomPassword();
        var hasher = new PasswordHasher<Users>();
        model.HashKey = hasher.HashPassword(model, tempPassword);

        model.IsDeleted = false;
        model.CreatedAt = DateTime.UtcNow;
        await _unitofwork.Repository<Users>().Add(model);
        var result = await _unitofwork.SaveChangesAsync();
        if (result > 0)
        {
            // Step 4: Prepare email
            string subject = "DeutPak Portal - Account Details";
            string body = $@"
                <h2>Welcome, {model.Name}!</h2>
                <p>Your account has been created successfully. Below are your login credentials:</p>
                <p>
                <strong>URL:</strong> https://portal.deutpak.com/<br/>
                <strong>Username:</strong> {model.Email}<br/>
                <strong>Password:</strong> {tempPassword}</p>
                <p>Please change your password after your first login.</p>
                <br/><br/>
                 <table>
                    <tr>
                        <td>
                            <img src='https://deutpak.com/assets/logo-BYY7rDEm.png' alt='DeutPak Auto Mieten' width='80' />
                        </td>
                        <td style='padding-left: 20px;'>
                            <p style='margin: 0; font-weight: bold;'>DeutPak Auto Mieten</p>
                            <p style='margin: 0;'>info@deutpak.com</p>
                            <p style='margin: 0;'>+49 123 456789</p>
                            <p style='margin: 0; font-size: 12px; color: #666;'>This is an automated message. Please do not reply.</p>
                        </td>
                    </tr>
                </table>
            ";

            // Sending the email
            await _emailService.SendEmailAsync(model.Email, subject, body);
        }


        return Ok(new { message = "User added successfully." });
    }

    [HttpPatch]
    [Route("ChangeStatus")]
    public async Task<IActionResult> ChangeStatus(int id, string status)
    {
        var user = await _unitofwork.Repository<Users>().GetById(id);

        if (user == null)
            return NotFound("User not found.");

        if (status != "Active")
            user.IsActive = false;
        else
            user.IsActive = true;
            
        user.Status = status;

        await _unitofwork.Repository<Users>().Update(user);
        await _unitofwork.SaveChangesAsync();

        return Ok("User status updated successfully.");
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestVM model)
    {
        try
        {
            var user = await _unitofwork.Users().AuthenticateUser(model);

            if (user == null)
                return Unauthorized(new { message = "Invalid credentials" });

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            //new Claim("role", user.Role)
        };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!) // from appsettings.json
            );
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return Ok(new
            {
                success = true,
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiresIn = 3600,
                user
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", details = ex.Message });
        }
    }


}