using core.entities.contract;

namespace core.interfaces.contract;

public interface IAddOnsRepository : IGenericRepository<AddOns>
{
     Task<string> GetNextAddOnCode();
     Task<List<string>> ValidateAddOns(string name, int addOnId, string type);
}