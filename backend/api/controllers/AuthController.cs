using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using core.entities.client;
using core.interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using presentation.viewmodel;
using presentation.viewmodel.shared;

namespace api.controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : BaseController
{
    private readonly IConfiguration _configuration;

    public AuthController(IMapper mapper, IUnitOfWork unitOfWork, IConfiguration configuration) : base(mapper, unitOfWork)
    {
        _configuration = configuration;
    }

    // [HttpPost("Auth")]
    // public IActionResult Login([FromBody] LoginVM model)
    // {
        // // Converting Password to HasKey
        // var customer = _unitofwork.Customers().GetCredentials(model.Username);

        // if (customer == null)
        //     return false; // Email not found

        // // 2. Use PasswordHasher to verify password
        // var hasher = new PasswordHasher<Customer>();
        // var result = hasher.VerifyHashedPassword(customer, customer, model.Password);

        // // 3. Return true only if password matches
        // return result == PasswordVerificationResult.Success;

        // var claims = new[]
        // {
        //     new Claim(ClaimTypes.Name, model.Username),
        //     new Claim(ClaimTypes.Role, "Admin")
        // };

        // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        // var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // var token = new JwtSecurityToken(
        //     issuer: _configuration["Jwt:Issuer"],
        //     audience: _configuration["Jwt:Audience"],
        //     claims: claims,
        //     expires: DateTime.Now.AddMinutes(30),
        //     signingCredentials: creds
        // );

        //return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
    //}
}
