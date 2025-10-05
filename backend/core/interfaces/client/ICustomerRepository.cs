using core.entities.client;
using presentation.viewmodel.customers;

namespace core.interfaces.client;

public interface ICustomerRepository : IGenericRepository<Customer>
{
    //Any additional methods go here
    Task<List<CustomerBriefVM>> GetCustomerBrief(int? id = null);
    Task<string> GetNextCustomerCode();
    Task<List<string>> ValidateCustomer(AddCustomerVM model, string type);
    Task<int> CustomerExists(string email);
    Task<int> GetCustomerID(string email);
    string GenerateRandomPassword();
    string? GetCredentials(string email);
    Task<CustomerDetailsVM> GetCustomerDetails(int id);

}