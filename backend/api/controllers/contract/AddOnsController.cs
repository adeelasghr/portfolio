using AutoMapper;
using core.entities.contract;
using core.interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using presentation.viewmodel.shared;

namespace api.controllers.contract;

[ApiController]
[Route("api/[controller]")]
public class AddOnsController : BaseController
{
    public AddOnsController(IMapper mapper, IUnitOfWork unitOfWork) : base(mapper, unitOfWork) { }

    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _unitofwork.Repository<AddOns>().GetAll().ToListAsync());
    }

    [HttpGet]
    [Route("GetNewCode")]
    public async Task<IActionResult> GetNewCode()
    {
        string newCode = await _unitofwork.AddOns().GetNextAddOnCode();
        return Ok(newCode);
    }

    [HttpPost]
    [Route("AddAddOns")]
    public async Task<IActionResult> AddAddOns([FromForm] AddAddOnsVM model)
    {
        var validationErrors = await _unitofwork.AddOns().ValidateAddOns(model.AddOnName ?? string.Empty, 0, "add");
        if (validationErrors.Any())
        {
            return BadRequest(new { Errors = validationErrors });
        }

        string AddOnNewCode = await _unitofwork.AddOns().GetNextAddOnCode();

        // Setting up Image upload
        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "addons");
        Directory.CreateDirectory(uploadPath);
        if (model.Image == null)
        {
            return BadRequest(new { Errors = new[] { "Image file is required." } });
        }

        var extension = Path.GetExtension(model.Image.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}-{AddOnNewCode}{extension}";
        var filePath = Path.Combine(uploadPath, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await model.Image.CopyToAsync(stream);
        }

        var AddOns = new AddOns
        {
            AddOnCode = AddOnNewCode,
            AddOnName = model.AddOnName,
            Deatils = model.Deatils ?? string.Empty,
            Price = model.Price,
            Image = $"/uploads/addons/{uniqueFileName}",
            CreatedAt = DateTime.Now,
            IsActive = true,
            IsDeleted = false,
        };

        await _unitofwork.Repository<AddOns>().Add(AddOns);
        await _unitofwork.SaveChangesAsync();

        return Ok(new { message = "AddOn added successfully." });
    }
}