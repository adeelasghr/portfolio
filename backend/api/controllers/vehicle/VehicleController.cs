using AutoMapper;
using core.entities.vehicle;
using core.interfaces;
using Microsoft.AspNetCore.Mvc;
using presentation.viewmodel.vehicles;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace api.controllers.vehicle;

[ApiController]
[Route("api/[controller]")]
public class VehicleController : BaseController
{
    public VehicleController(IMapper mapper, IUnitOfWork unitOfWork) : base(mapper, unitOfWork) { }

    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _unitofwork.Repository<Vehicle>().GetAll().ToListAsync());
    }

    [HttpGet]
    [Route("GetVehicleDetails")]
    public async Task<IActionResult> GetVehicleDetails(int id)
    {
        return Ok(await _unitofwork.Vehicles().GetVehicleDetails(id));
    }
    [HttpGet]
    [Route("GetVehicleByType")]
    public async Task<IActionResult> GetVehicleByType(int id)
    {
        return Ok(await _unitofwork.Vehicles().GetVehicleByType(id));
    }

    [HttpGet]
    [Route("GetVehicleHistory")]
    public async Task<IActionResult> GetVehicleHistory(int id)
    {
        return Ok(await _unitofwork.Vehicles().GetVehicleHistory(id));
    }

    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetById(int id)
    {
        var client = await _unitofwork.Repository<Vehicle>().GetById(id);
        if (client is null)
            return NotFound();
        return Ok(client);
    }

    [HttpGet]
    [Route("GetAllVehicleNames")]
    public async Task<IActionResult> GetAllVehicleNames()
    {
       return Ok(await _unitofwork.Vehicles().GetAllVehicleNames());
    }

    [HttpGet]
    [Route("GetBrief")]
    public async Task<IActionResult> GetBrief(int? id = null)
    {
        if (id.HasValue)
        {
            var vehicle = await _unitofwork.Vehicles().GetVehicleBrief(id.Value);
            if (vehicle is null)
                return NotFound();
            return Ok(vehicle);
        }
        else
        {
            var vehicle = await _unitofwork.Vehicles().GetVehicleBrief();
            if (vehicle is null)
                return NotFound();
            return Ok(vehicle);
        }
    }

    [HttpGet]
    [Route("GetNewCode")]
    public async Task<IActionResult> GetNewCode()
    {
        string newCode = await _unitofwork.Vehicles().GetNextVehicleCode();
        return Ok(newCode);
    }

    [HttpGet]
    [Route("GetStats")]
    public async Task<IActionResult> GetStats(int id)
    {
        var stats = await _unitofwork.Vehicles().GetVehicleStats(id);
        return Ok(stats);
    }

    [HttpPost]
    [Route("AddVehicle")]
    public async Task<IActionResult> AddVehicle([FromForm] AddVehicleVM model, [FromForm] string MaintenanceSchedule)
    {
        var validationErrors = await _unitofwork.Vehicles().ValidateVehicle(model, "add");
        if (validationErrors.Any())
        {
            return BadRequest(new { Errors = validationErrors });
        }

        var vehicle = _mapper.Map<Vehicle>(model);

        // Setting in addition values
        vehicle.VehicleCode = await _unitofwork.Vehicles().GetNextVehicleCode();
        vehicle.CreatedAt = DateTime.Now;
        vehicle.IsActive = true;
        vehicle.IsDeleted = false;
        vehicle.Status = "Available";

        await _unitofwork.Repository<Vehicle>().Add(vehicle);
        await _unitofwork.SaveChangesAsync();


        //Adding Vehiclce History
        var history = new VehicleHistory
        {
            VehicleID = vehicle.VehicleID,
            EventType = "Created",
            EventDescription = "Added to the system",
            CreatedAt = DateTime.Now,
            IsActive = true,
            IsDeleted = false,
        };

        await _unitofwork.Repository<VehicleHistory>().Add(history);

        // Saving Images
        if (model.VehicleImages != null && model.VehicleImages.Any())
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "vehicles");
            Directory.CreateDirectory(uploadPath);

            foreach (var image in model.VehicleImages)
            {
                //Getting the extension
                var extension = Path.GetExtension(image.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}-{vehicle.VehicleCode}{extension}";
                var filePath = Path.Combine(uploadPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var imageEntity = new VehicleImage
                {
                    VehicleID = vehicle.VehicleID,
                    FileName = uniqueFileName,
                    FilePath = $"/uploads/vehicles/{uniqueFileName}",
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    IsDeleted = false
                };

                await _unitofwork.Repository<VehicleImage>().Add(imageEntity);
            }
            await _unitofwork.SaveChangesAsync();
        }

        await _unitofwork.SaveChangesAsync();

        return Ok(new { message = "Vehicle added successfully." });
    }

    [HttpPatch]
    [Route("DeleteVehicle")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
        var client = await _unitofwork.Repository<Vehicle>().GetById(id);
        if (client is null)
            return NotFound();
        await _unitofwork.Repository<Vehicle>().Remove(id);
        await _unitofwork.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch]
    [Route("UpdateVehicle")]
    public async Task<IActionResult> UpdateVehicle(UpdateVehicleVM vehicle)
    {
        //Fetching Customer
        var existVehicle = await _unitofwork.Repository<Vehicle>().GetById(vehicle.ID);
        if (existVehicle is null)
            return NotFound();

        //Validating
        var validationErrors = await _unitofwork.Vehicles().ValidateUpdateVehicle(vehicle);
        if (validationErrors.Any())
        {
            return BadRequest(new { Errors = validationErrors });
        }

        _mapper.Map(vehicle, existVehicle);

        await _unitofwork.Repository<Vehicle>().Update(existVehicle);
        await _unitofwork.SaveChangesAsync();

        return Ok();
    }

    [HttpPatch]
    [Route("ChangeStatus")]
    public async Task<IActionResult> ChangeStatus(int id, string status)
    {
        var vehicle = await _unitofwork.Repository<Vehicle>().GetById(id);

        if (vehicle == null)
            return NotFound("Vehicle not found.");

        vehicle.Status = status;

        await _unitofwork.Repository<Vehicle>().Update(vehicle);
        await _unitofwork.SaveChangesAsync();

        //Adding Inspection Vehiclce History
        var historyIns = new VehicleHistory
        {
            VehicleID = vehicle.VehicleID,
            EventType = "Status Changed",
            EventDescription = "The vehicle was " + status,
            CreatedAt = vehicle.CreatedAt.AddMinutes(1),
            IsActive = true,
            IsDeleted = false,
        };


        await _unitofwork.Repository<VehicleHistory>().Add(historyIns);
        await _unitofwork.SaveChangesAsync();

        return Ok("Vehicle status updated successfully.");
    }

    [HttpGet("brands")]
    public async Task<IActionResult> GetVehicleBrands()
    {
        var brands = await _unitofwork.Vehicles().GetVehicleBrands();
        return Ok(brands);
    }

    [HttpGet("types")]
    public async Task<IActionResult> GetVehicleTypes()
    {
        var types = await _unitofwork.Vehicles().GetVehicleTypes();
        return Ok(types);
    }

    [HttpGet("models")]
    public async Task<IActionResult> GetVehicleModels(int brandId)
    {
        var models = await _unitofwork.Vehicles().GetVehicleModels(brandId);
        return Ok(models);
    }

    [HttpGet("transmissions")]
    public async Task<IActionResult> GetVehicleTransmissions()
    {
        var transmissions = await _unitofwork.Vehicles().GetVehicleTransmissions();
        return Ok(transmissions);
    }

    [HttpGet("fuels")]
    public async Task<IActionResult> GetVehicleFuelTypes()
    {
        var fuels = await _unitofwork.Vehicles().GetVehicleFuelTypes();
        return Ok(fuels);
    }

    [HttpGet("groups")]
    public async Task<IActionResult> GetVehicleGroups()
    {
        var fuels = await _unitofwork.Vehicles().GetVehicleGroups();
        return Ok(fuels);
    }
}