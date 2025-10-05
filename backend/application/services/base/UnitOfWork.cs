
using application.services.client;
using application.services.contract;

using application.services.user;
using AutoMapper;
using core.entities;
using core.interfaces;

using core.interfaces.client;
using core.interfaces.contract;

using core.interfaces.user;
using core.interfaces.vehicle;
using infastructure.data;
namespace application.services;

public class UnitOfWork : IUnitOfWork
{
    protected readonly DatabaseContext _context;
    private readonly IMapper _mapper;
    private readonly Dictionary<Type, object> _repositories = new();
    private ICustomerRepository _customerRepository;
    private IVehicleRepository _vehicleRepository;
    private IContractRepository _contractRepository;
    private IAddOnsRepository _addOnsRepository;
    private IUserRepository _usersRepository;
     private IVehicleChangeHistoryRepository _vehChangeHistoryRepository;


    public UnitOfWork(DatabaseContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;

        _customerRepository = new CustomerService(_context, _mapper);
        _vehicleRepository = new VehicleService(_context, _mapper);
        _contractRepository = new ContractService(_context, _mapper);
        _addOnsRepository = new AddOnsService(_context, _mapper);
        _usersRepository = new UserService(_context, _mapper);
        _vehChangeHistoryRepository = new VehicleChangeHistoryService(_context, _mapper);
    }

    public IGenericRepository<T> Repository<T>() where T : BaseEntity
    {
        if (!_repositories.ContainsKey(typeof(T)))
        {
            _repositories[typeof(T)] = new GenericRepository<T>(_context);
        }
        return (IGenericRepository<T>)_repositories[typeof(T)];
    }

    // Adding custom Custom Repository
    public ICustomerRepository Customers()
    {
            return _customerRepository;
    }
     public IVehicleRepository Vehicles()
    {
            return _vehicleRepository;
    }

    public IContractRepository Contracts()
    {
        return _contractRepository;
    }
    
    public IAddOnsRepository AddOns()
    {
        return _addOnsRepository;
    }

    public IUserRepository Users()
    {
        return _usersRepository;
    }

     public IVehicleChangeHistoryRepository VehicleChangeHistory()
    {
        return _vehChangeHistoryRepository;
    }

    // Saves all changes to the database in one go
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    // Releases the database connection when done
    public void Dispose()
    {
        _context.Dispose();
    }

}