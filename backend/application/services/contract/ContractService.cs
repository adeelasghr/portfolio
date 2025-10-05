using AutoMapper;
using AutoMapper.QueryableExtensions;
using core.entities.contract;
using core.interfaces.contract;
using infastructure.data;
using Microsoft.EntityFrameworkCore;
using presentation.viewmodel.contract;
using presentation.viewmodel.shared;

namespace application.services.contract;

public class ContractService : GenericRepository<Contract>, IContractRepository
{
    private readonly IMapper _mapper;
    public ContractService(DatabaseContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<List<ContractCalendarVM>> GetContractCalendar(DateTime startDate, DateTime endDate)
    {
        var query = _dbContext.Contracts
            .Where(e => !e.IsDeleted && e.PickupDateTime.Date >= startDate.Date && e.DropOffDateTime.Date <= endDate.Date)
            .AsNoTracking()
            .ProjectTo<ContractCalendarVM>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return await query;
    }

    public async Task<List<ContractBriefVM>> GetContractBrief(int? id = null)
    {
        var query = _dbContext.Contracts.Where(e => !e.IsDeleted).AsNoTracking();
        if (id.HasValue)
        {
            query = query.Where(c => c.ContractID == id.Value);
        }
        return await query
        .OrderByDescending(c => c.ContractID)
        .ProjectTo<ContractBriefVM>(_mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<string> GetNextContractCode()
    {
        // Get the contract with the highest CustomerCode
        var latestContract = await _dbContext.Contracts
            .OrderByDescending(c => c.ContractCode)
            .FirstOrDefaultAsync();

        // If no customers exist, start from 1001
        if (latestContract == null || string.IsNullOrWhiteSpace(latestContract.ContractCode))
            return "CN-1001";

        var numericPart = latestContract.ContractCode.Substring(3); //Removing CN-

        // Parsing the latest code
        if (int.TryParse(numericPart, out int lastCodeNumber))
        {
            return $"CN-{lastCodeNumber + 1}";
        }

        throw new Exception("Invalid Contract Code format in database.");
    }

    public async Task<PrintContractVM> PrintContract(int id)
    {
        var contract = await _dbContext.Contracts
            .Where(c => c.ContractID == id)
            .Include(c => c.AddOns)
            .Include(c => c.Users)
            .ProjectTo<PrintContractVM>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (contract == null)
            throw new KeyNotFoundException($"Contract with ID {id} not found");

        return contract;
    }

    // public async Task<ContractTimelineVM> GetContractTimeline(int id)
    // {
    //     var contract = await _dbContext.Contracts
    //         .Where(c => c.ContractID == id && !c.IsDeleted)
    //         .Include(c => c.Vehicle)
    //         .Include(c => c.Customer)
    //         .Include(c => c.History)
    //         .AsNoTracking()
    //         .FirstOrDefaultAsync();

    //     if (contract == null)
    //         throw new KeyNotFoundException($"Contract with ID {id} not found");

    //     var timeline = (contract.History ?? new List<ContractHistory>())
    //         .OrderBy(h => h.CreatedAt != default ? h.CreatedAt : DateTime.MinValue)
    //         .Select(h => new TimelineVM
    //         {
    //             EventDate = h.CreatedAt,
    //             EventTitle = h.ChangeType ?? "Unknown",
    //             Description = h.Remarks ?? ""
    //         })
    //         .ToList();

    //     return new ContractTimelineVM
    //     {
    //         ContractCode = contract.ContractCode ?? string.Empty,
    //         PickupLocID = contract.PickupLocID,
    //         DropOffLocID = contract.DropOffLocID,
    //         PickupDateTime = contract.PickupDateTime,
    //         DropOffDateTime = contract.DropOffDateTime,
    //         TotalAmount = contract.TotalAmount,
    //         Status = contract.Status ?? "N/A",
    //         CustomerName = contract.Customer?.FirstName ?? "N/A",
    //         VehicleName = contract.Vehicle?.Brand.Name ?? "N/A",
    //         Timeline = timeline
    //     };
    // }

    public async Task<ContractOverviewVM> ContractOverview(int id)
    {
        var overview = await _dbContext.Contracts
            .Where(c => c.ContractID == id)
            .Include(c => c.Vehicle)
            .Include(c => c.Customer)
            .ProjectTo<ContractOverviewVM>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (overview == null)
            throw new KeyNotFoundException($"Contract with ID {id} not found");

        return overview;
    }

    public async Task<ContractDetailsVM> GetDetails(int id)
    {
        var overview = await _dbContext.Contracts
            .Where(c => c.ContractID == id)
            .Include(c => c.AddOns)
            .ProjectTo<ContractDetailsVM>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (overview == null)
            throw new KeyNotFoundException($"Contract with ID {id} not found");

        return overview;
    }

    public async Task ArchiveContract(int contractId, int changedByUserId)
    {
        // Load contract with its children
        var contract = await _dbContext.Contracts
            .Include(c => c.AddOns)
            .Include(c => c.Finances)
            .FirstOrDefaultAsync(c => c.ContractID == contractId);

        if (contract == null)
            throw new KeyNotFoundException($"Contract {contractId} not found.");

        // 1. Archive contract itself
        var history = new ContractHistory
        {
            PickupDateTime = contract.PickupDateTime,
            DropOffDateTime = contract.DropOffDateTime,
            Status = contract.Status,
            Insurance = contract.Insurance,
            startFuelReading = contract.startFuelReading,
            endFuelReading = contract.endFuelReading,
            StartMileage = contract.StartMileage,
            EndMileage = contract.EndMileage,
            DailyRent = contract.DailyRent,
            TotalDays = contract.TotalDays,
            TotalRentals = contract.TotalRentals,
            AdditionalCharges = contract.AdditionalCharges,
            OtherCharges = contract.OtherCharges,
            Deposit = contract.Deposit,
            TotalAmount = contract.TotalAmount,
            Reference = contract.Reference,
            Remarks = contract.Remarks,
            ChangedBy = changedByUserId,
            ChangedAt = DateTime.UtcNow,
            BookingID = contract.BookingID,
            PickupLocID = contract.PickupLocID,
            DropOffLocID = contract.DropOffLocID,
            VehicleID = contract.VehicleID,
            CustomerID = contract.CustomerID,
            ContractID = contract.ContractID,
            TaxAmount = contract.TaxAmount
        };

        await _dbContext.ContractsHistory.AddAsync(history);
        await _dbContext.SaveChangesAsync(); // Save early so history gets an ID

        // 2. Archive AddOns
        if (contract.AddOns != null && contract.AddOns.Any())
        {
            var addOnHistories = contract.AddOns.Select(a => new ContractAddOnsHistory
            {
                AddOnsPrice = a.AddOnsPrice,
                AddOnDetail = a.AddOnDetail,
                AddOnsID = a.AddOnsID,
                CHistoryID = history.CHistoryID
            });

            await _dbContext.ContractAddOnsHistory.AddRangeAsync(addOnHistories);
        }

        // 3. Archive Finances
        if (contract.Finances != null && contract.Finances.Any())
        {
            var financeHistories = contract.Finances.Select(f => new ContractFinanceHistory
            {
                Amount = f.Amount,
                Quantity = f.Quantity,
                Remarks = f.Remarks,
                ContractItemID = f.FinanceItemID,
                CHistoryID = history.CHistoryID
            });

            await _dbContext.ContractFinanceHistory.AddRangeAsync(financeHistories);
        }

        // 4. Remove from live tables
        _dbContext.ContractAddOns.RemoveRange(contract.AddOns);
        _dbContext.ContractFinances.RemoveRange(contract.Finances);

        await _dbContext.SaveChangesAsync();
    }

    public Task<ContractTimelineVM> GetContractTimeline(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<GetCloseContractVM> GetDetailsForClose(int id)
    {
        var details = await _dbContext.Contracts
            .Where(c => c.ContractID == id)
            .Include(c => c.AddOns)
            .ProjectTo<GetCloseContractVM>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync();

        if (details == null)
            throw new KeyNotFoundException($"Contract with ID {id} not found");

        // Check if Fuel Coverage is among the AddOns
        var hasFuelCoverage = await _dbContext.ContractAddOns
        .AnyAsync(ca => ca.ContractID == id && ca.AddOnsID == 27);

        details.FuelCoverage = hasFuelCoverage ? "Yes" : "No";

        var extraKmAddOn = await _dbContext.ContractAddOns
        .Include(ca => ca.AddOns)
        .FirstOrDefaultAsync(ca => ca.ContractID == id && ca.AddOnsID == 16);

        var extraKMs = extraKmAddOn?.AddOnDetail ?? "0";
        details.KMAllowed = 500 + (int.TryParse(extraKMs, out var parsed) ? parsed : 0);

        return details;
    }

    public async Task<GetEditClosedContractVM> GetDetailsForEditClose(int id)
    {
        var details = await _dbContext.Contracts
            .Where(c => c.ContractID == id)
            .Select(c => new GetEditClosedContractVM
            {
                ContractID = c.ContractID,
                SecurityDeposit = c.Deposit,
                Discount = c.Discount,
                TotalAmount = c.TotalAmount,
                TaxAmount = c.TaxAmount,
                ContractCode = c.ContractCode,

                ExcessiveCleaning = c.Finances
                    .Where(f => f.FinanceItemID == 5)
                    .Select(f => f.Amount)
                    .FirstOrDefault(),

                DamageCharges = c.Finances
                    .Where(f => f.FinanceItemID == 6)
                    .Select(f => f.Amount)
                    .FirstOrDefault(),

                MissingAccessory = c.Finances
                    .Where(f => f.FinanceItemID == 7)
                    .Select(f => f.Amount)
                    .FirstOrDefault(),

                ExcessMilage = c.Finances
                    .Where(f => f.FinanceItemID == 8)
                    .Select(f => f.Amount)
                    .FirstOrDefault(),

                LateReturn = c.Finances
                    .Where(f => f.FinanceItemID == 9)
                    .Select(f => f.Amount)
                    .FirstOrDefault(),

                FuelAdjustment = c.Finances
                    .Where(f => f.FinanceItemID == 10)
                    .Select(f => f.Amount)
                    .FirstOrDefault(),
            })
            .FirstOrDefaultAsync();

        if (details == null)
            throw new KeyNotFoundException($"Contract with ID {id} not found");

        return details;
    }

}