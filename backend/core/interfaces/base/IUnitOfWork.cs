using core.entities;
using core.interfaces.client;
using core.interfaces.contract;
using core.interfaces.user;
using core.interfaces.vehicle;
namespace core.interfaces;

public interface IUnitOfWork : IDisposable
{
      IGenericRepository<T> Repository<T>() where T : BaseEntity;
      ICustomerRepository Customers();
      IUserRepository Users();
      IContractRepository Contracts();
      IVehicleRepository Vehicles();
     
      IAddOnsRepository AddOns();
      IVehicleChangeHistoryRepository VehicleChangeHistory();
      Task<int> SaveChangesAsync();
}