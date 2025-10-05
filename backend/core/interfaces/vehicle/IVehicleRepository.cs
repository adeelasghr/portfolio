using core.entities.vehicle;
using presentation.viewmodel.shared;
using presentation.viewmodel.vehicles;

namespace core.interfaces.vehicle;

public interface IVehicleRepository : IGenericRepository<Vehicle>
{
    //Any additional methods go here
    Task<List<VehicleBriefVM>> GetVehicleBrief(int? id = null);
     Task<List<VehiclePreviewVM>> GetVehicleByType(int id);
    Task<string> GetNextVehicleCode();
    Task<List<string>> ValidateVehicle(AddVehicleVM model, string type);
    Task<List<string>> ValidateUpdateVehicle(UpdateVehicleVM model);
    Task<VehicleDetailsVM> GetVehicleDetails(int id);
    Task<VehicleHistoryVM> GetVehicleHistory(int id);
    Task<VehicleStatsVM> GetVehicleStats(int id);

    // Supporting methods for vehicle management
    Task<List<LookUpVM>> GetAllVehicleNames();
    Task<List<LookUpVM>> GetVehicleBrands();
    Task<List<LookUpVM>> GetVehicleTypes();
    Task<List<LookUpVM>> GetVehicleModels(int brandId);
    Task<List<LookUpVM>> GetVehicleTransmissions();
    Task<List<LookUpVM>> GetVehicleFuelTypes();
    Task<List<LookUpVM>> GetVehicleGroups();

}