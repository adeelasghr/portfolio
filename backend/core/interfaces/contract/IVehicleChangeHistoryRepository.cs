using core.entities.contract;

namespace core.interfaces.contract;

public interface IVehicleChangeHistoryRepository : IGenericRepository<VehicleChangeHistory>
{
    Task<List<VehicleChangeHistory>> GetAllEntries(int contractID);
}