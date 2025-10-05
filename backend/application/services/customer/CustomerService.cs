using AutoMapper;
using AutoMapper.QueryableExtensions;
using core.entities.client;
using core.interfaces.client;
using infastructure.data;
using Microsoft.EntityFrameworkCore;
using presentation.viewmodel.customers;

namespace application.services.client;

public class CustomerService : GenericRepository<Customer>, ICustomerRepository
{
    private readonly IMapper _mapper;
    public CustomerService(DatabaseContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<int> CustomerExists(string email)
    {
        var customer = await _dbContext.Customers
                        .Where(c => c.Email == email)
                        .Select(c => c.CustomerID)
                        .FirstOrDefaultAsync();

        return customer;
    }

    public async Task<List<CustomerBriefVM>> GetCustomerBrief(int? id = null)
    {
        var query = _dbContext.Customers.Where(e => !e.IsDeleted).AsNoTracking();
        if (id.HasValue)
        {
            query = query.Where(c => c.CustomerID == id.Value);
        }
        return await query
        .OrderByDescending(c => c.CustomerID) 
        .ProjectTo<CustomerBriefVM>(_mapper.ConfigurationProvider)
        .ToListAsync();
    }

    public async Task<int> GetCustomerID(string email)
    {
        return await _dbContext.Customers
       .Where(c => c.Email == email && !c.IsDeleted)
       .Select(c => c.CustomerID)
       .FirstOrDefaultAsync();
    }

    public async Task<string> GetNextCustomerCode()
    {
        // Get the customer with the highest CustomerCode
        var latestCustomer = await _dbContext.Customers
            .OrderByDescending(c => c.CustomerCode)
            .FirstOrDefaultAsync();

        // If no customers exist, start from 1001
        if (latestCustomer == null || string.IsNullOrWhiteSpace(latestCustomer.CustomerCode))
            return "CL-1001";

        var numericPart = latestCustomer.CustomerCode.Substring(3); //Removing CL-

        // Parsing the latest code
        if (int.TryParse(numericPart, out int lastCodeNumber))
        {
            return $"CL-{lastCodeNumber + 1}";
        }

        throw new Exception("Invalid CustomerCode format in database.");
    }

    public async Task<List<string>> ValidateCustomer(AddCustomerVM model, string type)
    {
        var errors = new List<string>();

        if (type == "add")
        {
            if (await _dbContext.Customers.AnyAsync(c => c.Email == model.Email && !c.IsDeleted))
                errors.Add("This email address already exists in the system.");

            if (await _dbContext.Customers.AnyAsync(c => c.PhoneNumber == model.PhoneNumber && !c.IsDeleted))
                errors.Add("Phone number already exists.");
        }
        if (type == "update")
        {
            if (await _dbContext.Customers.AnyAsync(c => c.Email == model.Email && c.CustomerID != model.ID && !c.IsDeleted))
                errors.Add("Email already exists.");

            if (await _dbContext.Customers.AnyAsync(c => c.PhoneNumber == model.PhoneNumber && c.CustomerID != model.ID && !c.IsDeleted))
                errors.Add("Phone number already exists.");
        }

        // var minValidDate = DateTime.Today.AddMonths(6);
        // if (model.LicenseExpiry < minValidDate)
        //     errors.Add("License must be valid for 6+ months.");


        return errors;
    }

    public string GenerateRandomPassword()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 8)
            .Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public string? GetCredentials(string email)
    {
        var customer = _dbContext.Customers
      .FirstOrDefault(c => c.Email == email && !c.IsDeleted);

        return customer?.HashKey;
    }
    
    public async Task<CustomerDetailsVM> GetCustomerDetails(int id)
    {
        var customer = await _dbContext.Customers
        .Include(v => v.CustomerDocs)
        .FirstOrDefaultAsync(v => v.CustomerID == id);

        if (customer == null)
            return new CustomerDetailsVM();

        var vm = new CustomerDetailsVM
        {
            CustomerCode = customer.CustomerCode,
            CreatedAt = customer.CreatedAt,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email,
            DOB = customer.DOB,
            PhoneNumber = customer.PhoneNumber,
            Picture = customer.Picture,
            StreetName = customer.StreetName,
            HouseNo = customer.HouseNo,
            PostalCode = customer.PostalCode,
            City = customer.City,
            Country = customer.Country,
            AdditionalInfo = customer.AdditionalInfo,
            PassportNo = customer.PassportNo,
            PassportIssue = customer.PassportIssue,
            PassportExpiry = customer.PassportExpiry,
            IDCardNo = customer.IDCardNo,
            IDCardIssue = customer.IDCardIssue,
            IDCardExpiry = customer.IDCardExpiry,
            LicenseNo = customer.LicenseNo,
            LicenseIssue = customer.LicenseIssue,
            LicenseExpiry = customer.LicenseExpiry,
            CustomerDocs = customer.CustomerDocs?.Select(doc => doc.FilePath).ToList() ?? new List<string>(),
        };

        return vm;
    }
}