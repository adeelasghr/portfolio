using AutoMapper;
using core.entities.contract;
using core.interfaces.contract;
using infastructure.data;
using Microsoft.EntityFrameworkCore;

namespace application.services.contract;

public class VehicleChangeHistoryService : GenericRepository<VehicleChangeHistory>, IVehicleChangeHistoryRepository
{
    private readonly IMapper _mapper;
    public VehicleChangeHistoryService(DatabaseContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<List<VehicleChangeHistory>> GetAllEntries(int contractID)
    {
        return await _dbContext.VehicleChangeHistory.Where(v => v.ContractID == contractID && !v.IsDeleted).ToListAsync();
    }
}