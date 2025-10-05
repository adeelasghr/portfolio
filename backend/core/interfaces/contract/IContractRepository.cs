
using core.entities.contract;
using presentation.viewmodel.contract;
using presentation.viewmodel.shared;

namespace core.interfaces.contract;

public interface IContractRepository : IGenericRepository<Contract>
{
     Task<string> GetNextContractCode();
     Task<List<ContractBriefVM>> GetContractBrief(int? id = null);
     Task<List<ContractCalendarVM>> GetContractCalendar(DateTime startDate, DateTime endDate);
     Task<PrintContractVM> PrintContract(int id);
     Task<ContractTimelineVM> GetContractTimeline(int id);
     Task<GetCloseContractVM> GetDetailsForClose(int id);
     Task<GetEditClosedContractVM> GetDetailsForEditClose(int id);
     Task<ContractOverviewVM> ContractOverview(int id);
     Task<ContractDetailsVM> GetDetails(int id);
     Task ArchiveContract(int contractId, int changedByUserId);
}