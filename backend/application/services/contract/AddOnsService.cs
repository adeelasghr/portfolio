using AutoMapper;
using core.entities.contract;
using core.interfaces.contract;
using infastructure.data;
using Microsoft.EntityFrameworkCore;

namespace application.services.contract;

public class AddOnsService : GenericRepository<AddOns>, IAddOnsRepository
{
    private readonly IMapper _mapper;
    public AddOnsService(DatabaseContext context, IMapper mapper) : base(context)
    {
        _mapper = mapper;
    }

    public async Task<string> GetNextAddOnCode()
    {
         // Get the users with the highest CustomerCode
        var latestUser = await _dbContext.AddOns
            .OrderByDescending(c => c.AddOnCode)
            .FirstOrDefaultAsync();

        // If no vehicle exist, start from 1001
        if (latestUser == null || string.IsNullOrWhiteSpace(latestUser.AddOnCode))
            return "AD-1001";

        var numericPart = latestUser.AddOnCode.Substring(3); //Removing AD-

        // Parsing the latest code
        if (int.TryParse(numericPart, out int lastCodeNumber))
        {
            return $"AD-{lastCodeNumber + 1}";
        }
        throw new Exception("Invalid AddOns Code format in database.");
    }

    public async Task<List<string>> ValidateAddOns(string name, int addOnId, string type)
    {
        var errors = new List<string>();

        if (type == "add")
        {
            if (await _dbContext.AddOns.AnyAsync(c => c.AddOnName == name && !c.IsDeleted))
                errors.Add("An AddOn with this name already exists.");
        }
        if (type == "update")
        {
            if (await _dbContext.AddOns.AnyAsync(c => c.AddOnName == name && c.AddOnID != addOnId && !c.IsDeleted))
                 errors.Add("A AddOn with this name already exists.");
        }
        return errors;
    }
}