using AutoMapper;
using core.entities.client;
using core.interfaces;
using Microsoft.AspNetCore.Mvc;
using presentation.viewmodel.customers;
using Microsoft.AspNetCore.Identity;
using core.interfaces.email;
using Microsoft.EntityFrameworkCore;

namespace api.client;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : BaseController
{
    private readonly IEmailService _emailService;
    public CustomerController(IMapper mapper, IUnitOfWork unitOfWork, IEmailService emailService) : base(mapper, unitOfWork)
    {
        _emailService = emailService;
    }

    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _unitofwork.Repository<Customer>().GetAll().ToListAsync());
    }

    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetById(int id)
    {
        var client = await _unitofwork.Repository<Customer>().GetById(id);
        if (client is null)
            return NotFound();
        return Ok(client);
    }

    [HttpGet]
    [Route("GetBrief")]
    public async Task<IActionResult> GetBrief(int? id = null)
    {
        if (id.HasValue)
        {
            var client = await _unitofwork.Customers().GetCustomerBrief(id.Value);
            if (client is null)
                return NotFound();
            return Ok(client);
        }
        else
        {
            var client = await _unitofwork.Customers().GetCustomerBrief();
            if (client is null)
                return NotFound();
            return Ok(client);
        }
    }

    [HttpGet]
    [Route("GetNewCode")]
    public async Task<IActionResult> GetNewCode()
    {
        string newCode = await _unitofwork.Customers().GetNextCustomerCode();
        return Ok(newCode);
    }

    [HttpPost]
    [Route("AddCustomer")]
    public async Task<IActionResult> AddCustomer([FromForm] AddCustomerVM model)
    {
        try
        {


            string tempPassword;
            var validationErrors = await _unitofwork.Customers().ValidateCustomer(model, "add");
            if (validationErrors.Any())
            {
                return BadRequest(new { Errors = validationErrors });
            }

            var customer = _mapper.Map<Customer>(model);

            // Setting in addition values
            customer.CustomerCode = await _unitofwork.Customers().GetNextCustomerCode();
            customer.CreatedAt = DateTime.Now;
            customer.IsActive = true;
            customer.IsDeleted = false;
            customer.AccountType = "Elite";
            customer.Picture = "/uploads/customers/default.png";

            // Setting up the password
            tempPassword = _unitofwork.Customers().GenerateRandomPassword();
            var hasher = new PasswordHasher<Customer>();
            customer.HashKey = hasher.HashPassword(customer, tempPassword);

            await _unitofwork.Repository<Customer>().Add(customer);
            await _unitofwork.SaveChangesAsync();

            // Saving Documents
            if (model.CustomerDocs != null && model.CustomerDocs.Any())
            {
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "customers");
                Directory.CreateDirectory(uploadPath);

                foreach (var image in model.CustomerDocs)
                {
                    //Getting the extension
                    var extension = Path.GetExtension(image.FileName);
                    var uniqueFileName = $"{Guid.NewGuid()}-{customer.CustomerCode}{extension}";
                    var filePath = Path.Combine(uploadPath, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    var imageEntity = new CustomerDoc
                    {
                        CustomerID = customer.CustomerID,
                        FileName = uniqueFileName,
                        FilePath = $"/uploads/customers/{uniqueFileName}",
                        CreatedAt = DateTime.Now,
                        IsActive = true,
                        IsDeleted = false
                    };

                    await _unitofwork.Repository<CustomerDoc>().Add(imageEntity);
                }
                await _unitofwork.SaveChangesAsync();
            }

            // Step 4: Prepare email
            string subject = "Your Account Details";
            string body = $@"
                <h2>Welcome, {customer.FirstName}!</h2>
                <p>Your account has been created successfully. Below are your login credentials:</p>
                <p><strong>Username:</strong> {customer.Email}<br/>
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
            await _emailService.SendEmailAsync(customer.Email, subject, body);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
        }

        return Ok(new { message = "Customer added successfully." });
    }

    [HttpPatch]
    [Route("DeleteCustomer")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var client = await _unitofwork.Repository<Customer>().GetById(id);
        if (client is null)
            return NotFound();
        await _unitofwork.Repository<Customer>().Remove(id);
        await _unitofwork.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch]
    [Route("UpdateCustomer")]
    public async Task<IActionResult> UpdateCustomer(AddCustomerVM customer)
    {
        //Fetching Customer
        var existClient = await _unitofwork.Repository<Customer>().GetById(customer.ID);
        if (existClient is null)
            return NotFound();

        //Validating
        var validationErrors = await _unitofwork.Customers().ValidateCustomer(customer, "update");
        if (validationErrors.Any())
        {
            return BadRequest(new { Errors = validationErrors });
        }

        _mapper.Map(customer, existClient);

        await _unitofwork.Repository<Customer>().Update(existClient);
        await _unitofwork.SaveChangesAsync();

        return Ok();
    }

    [HttpGet]
    [Route("GetCustomerDetails")]
    public async Task<IActionResult> GetCustomerDetails(int id)
    {
        return Ok(await _unitofwork.Customers().GetCustomerDetails(id));
    }
}