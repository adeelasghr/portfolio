using AutoMapper;
using AutoMapper.QueryableExtensions;
using core.entities.vehicle;
using core.interfaces.vehicle;
using infastructure.data;
using Microsoft.EntityFrameworkCore;
using presentation.viewmodel.shared;
using presentation.viewmodel.vehicles;

namespace application.services.client;

public class VehicleService : GenericRepository<Vehicle>, IVehicleRepository
{
    private readonly IMapper _mapper;
    public VehicleService(DatabaseContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }
    public async Task<List<VehicleBriefVM>> GetVehicleBrief(int? id = null)
    {
        var query = _dbContext.Vehicles.Where(e => !e.IsDeleted).AsNoTracking();
        if (id.HasValue)
        {
            query = query.Where(c => c.VehicleID == id.Value);
        }
        return await query
        .OrderByDescending(c => c.VehicleID)
        .ProjectTo<VehicleBriefVM>(_mapper.ConfigurationProvider)
        .ToListAsync();
    }
    public async Task<string> GetNextVehicleCode()
    {
        // Get the vehicle with the highest CustomerCode
        var latestVehicle = await _dbContext.Vehicles
            .OrderByDescending(c => c.VehicleCode)
            .FirstOrDefaultAsync();

        // If no vehicle exist, start from 1001
        if (latestVehicle == null || string.IsNullOrWhiteSpace(latestVehicle.VehicleCode))
            return "VH-1001";

        var numericPart = latestVehicle.VehicleCode.Substring(3); //Removing VH-

        // Parsing the latest code
        if (int.TryParse(numericPart, out int lastCodeNumber))
        {
            return $"VH-{lastCodeNumber + 1}";
        }
        throw new Exception("Invalid Vehicle Code format in database.");
    }
    public async Task<List<string>> ValidateVehicle(AddVehicleVM model, string type)
    {
        var errors = new List<string>();

        if (type == "add")
        {
            if (await _dbContext.Vehicles.AnyAsync(c => c.PlateNumber == model.PlateNumber && !c.IsDeleted))
                errors.Add("Plate Number already exists.");
        }
        if (type == "update")
        {
            if (await _dbContext.Vehicles.AnyAsync(c => c.PlateNumber == model.PlateNumber && c.VehicleID != model.ID && !c.IsDeleted))
                errors.Add("Plate Number already exists.");
        }
        return errors;
    }
    public async Task<List<string>> ValidateUpdateVehicle(UpdateVehicleVM model)
    {
        var errors = new List<string>();
        if (await _dbContext.Vehicles.AnyAsync(c => c.PlateNumber == model.PlateNumber && c.VehicleID != model.ID && !c.IsDeleted))
            errors.Add("Plate Number already exists.");
        return errors;
    }
    public async Task<List<LookUpVM>> GetVehicleBrands()
    {
        return await _dbContext.VehicleBrands
            .Where(b => !b.IsDeleted)
            .OrderBy(b => b.Name)
            .Select(b => new LookUpVM
            {
                ID = b.VehicleBrandID,
                Name = b.Name
            })
            .ToListAsync();
    }
    public async Task<List<LookUpVM>> GetVehicleTypes()
    {
        return await _dbContext.VehicleTypes
            .Where(t => !t.IsDeleted)
            .OrderBy(t => t.Name)
            .Select(t => new LookUpVM
            {
                ID = t.VehicleTypeID,
                Name = t.Name
            })
            .ToListAsync();
    }
    public async Task<List<LookUpVM>> GetVehicleModels(int brandId)
    {
        return await _dbContext.VehicleModels
            .Where(m => m.BrandID == brandId && !m.IsDeleted)
            .OrderBy(m => m.Name)
            .Select(m => new LookUpVM
            {
                ID = m.VehicleModelID,
                Name = m.Name
            })
            .ToListAsync();
    }
    public async Task<List<LookUpVM>> GetVehicleTransmissions()
    {
        return await _dbContext.Transmissions
            .Where(t => !t.IsDeleted)
            .OrderBy(t => t.Name)
            .Select(t => new LookUpVM
            {
                ID = t.TransmissionID,
                Name = t.Name
            })
            .ToListAsync();
    }
    public async Task<List<LookUpVM>> GetVehicleFuelTypes()
    {
        return await _dbContext.FuelTypes
            .Where(f => !f.IsDeleted)
            .OrderBy(f => f.Name)
            .Select(f => new LookUpVM
            {
                ID = f.FuelTypeID,
                Name = f.Name
            })
            .ToListAsync();
    }
    public async Task<List<LookUpVM>> GetVehicleGroups()
    {
        return await _dbContext.VehicleGroups
            .Where(f => !f.IsDeleted)
            .OrderBy(f => f.GroupExtName)
            .Select(f => new LookUpVM
            {
                ID = f.GroupID,
                Name = f.GroupIntName
            })
            .ToListAsync();
    }
    public async Task<VehicleDetailsVM> GetVehicleDetails(int id)
    {
        var vehicle = await _dbContext.Vehicles
        .Include(v => v.VehicleType)
        .Include(v => v.Brand)
        .Include(v => v.Model)
        .Include(v => v.Transmission)
        .Include(v => v.FuelType)
        .Include(v => v.VehicleGroup)
        .Include(v => v.VehicleImages)
        .FirstOrDefaultAsync(v => v.VehicleID == id);

        if (vehicle == null)
            return new VehicleDetailsVM();

        var vm = new VehicleDetailsVM
        {
            ID = vehicle.VehicleID,
            Code = vehicle.VehicleCode,
            PlateNumber = vehicle.PlateNumber,
            Year = vehicle.Year,
            DailyRate = vehicle.DailyRate,
            AC = vehicle.AC,
            NoOfSeats = vehicle.NoOfSeats,
            Color = vehicle.Color,
            Mileage = vehicle.Mileage,
            Luggage = vehicle.Luggage,
            Group = vehicle.VehicleGroup.GroupIntName,
            Status = vehicle.Status,
            Features = vehicle.Features,
            ShowOnWebsite = vehicle.ShowOnWebsite,
            Type = vehicle.VehicleType?.Name ?? string.Empty,
            Brand = vehicle.Brand?.Name ?? string.Empty,
            Model = vehicle.Model?.Name ?? string.Empty,
            Transmission = vehicle.Transmission?.Name ?? string.Empty,
            FuelType = vehicle.FuelType?.Name ?? string.Empty,
            CreatedOn = vehicle.CreatedAt
            ,
            VehicleImages = vehicle.VehicleImages?.Select(img => new VehicleImageVM
            {
                ImagePath = img.FilePath ?? string.Empty,
            }).ToList() ?? new List<VehicleImageVM>()
        };

        return vm;
    }
    public async Task<List<VehiclePreviewVM>> GetVehicleByType(int id)
    {
        var query = _dbContext.Vehicles
            .Include(v => v.VehicleType)
            .Include(v => v.Brand)
            .Include(v => v.Model)
            .Include(v => v.VehicleGroup)
            .Include(v => v.Transmission)
            .Include(v => v.FuelType)
            .Include(v => v.VehicleImages)
            .Where(v => v.IsActive && !v.IsDeleted && v.ShowOnWebsite);

        if (id != 0)
        {
            query = query.Where(v => v.VehicleTypeID == id);
        }

        var vehicles = await query.ToListAsync();

        // Remove spaces from VehicleType name
        foreach (var vehicle in vehicles)
        {
            if (vehicle.VehicleType?.Name != null)
            {
                vehicle.VehicleType.Name = vehicle.VehicleType.Name.Replace(" ", "");
            }
            if (vehicle.Features != null)
            {
                vehicle.Features = vehicle.Features.Replace(" ", "");
            }
        }

        return _mapper.Map<List<VehiclePreviewVM>>(vehicles);
    }
    public async Task<VehicleHistoryVM> GetVehicleHistory(int id)
    {
        var vehicle = await _dbContext.Vehicles
          .Include(v => v.Brand)
          .Include(v => v.Model)
           .Include(v => v.FuelType)
             .Include(v => v.VehicleGroup)
               .Include(v => v.VehicleType)
         .FirstOrDefaultAsync(v => v.VehicleID == id);

        if (vehicle == null)
            throw new KeyNotFoundException($"Vehicle with ID {id} not found.");

        var historyRecords = await _dbContext.VehicleHistory
            .Where(h => h.VehicleID == id)
            .OrderBy(h => h.CreatedAt)
            .ToListAsync();

        var vm = new VehicleHistoryVM
        {
            VehicleID = vehicle.VehicleID,
            VehicleName = vehicle.Brand.Name + " " + vehicle.Model.Name,
            VehicleCode = vehicle.VehicleCode,
            CreatedOn = vehicle.CreatedAt,
            DailyRate = vehicle.DailyRate,
            FuelType = vehicle.FuelType.Name,
            PlateNumber = vehicle.PlateNumber,
            Status = vehicle.Status,
            Group = vehicle.VehicleGroup.GroupIntName,
            VehicleType = vehicle.VehicleType?.Name ?? string.Empty,

            History = historyRecords.Select(h => new VehicleHistoryItemVM
            {
                EventType = h.EventType,
                EventDescription = h.EventDescription,
                CreatedAt = h.CreatedAt
            }).ToList()
        };

        return vm;
    }
    public async Task<List<LookUpVM>> GetAllVehicleNames()
    {
        var vehicles = await _dbContext.Vehicles
        .Include(v => v.Brand)
        .Include(v => v.Model)
        .Select(v => new LookUpVM
        {
            ID = v.VehicleID,
            Name = v.Brand.Name + " " + v.Model.Name + " (" + v.PlateNumber + ")"
        })
        .ToListAsync();

        return vehicles;
    }

    public async Task<VehicleStatsVM> GetVehicleStats(int id)
    {
        var vehicle = await _dbContext.Vehicles
        .FirstOrDefaultAsync(v => v.VehicleID == id);

        if (vehicle == null)
            throw new KeyNotFoundException($"Vehicle with ID {id} not found.");

        // Get contracts for the vehicle
        var contracts = await _dbContext.Contracts
            .Where(c => c.VehicleID == id)
            .ToListAsync();

        // Total income (e.g. sum of payments)
        var totalIncome = contracts.Sum(c => c.TotalAmount);

        var stats = new VehicleStatsVM
        {
            VehicleID = vehicle.VehicleID,
            VehicleCode = vehicle.VehicleCode,   // assuming you have a Code property
            Status = vehicle.Status,            // e.g. Available / Rented / Maintenance
            TotalContracts = contracts.Count,
            TotalIncome = totalIncome,
            TotalExpense = 0
        };

        return stats;
    }
}