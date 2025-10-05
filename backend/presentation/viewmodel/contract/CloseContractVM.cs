using Microsoft.AspNetCore.Http;

namespace presentation.viewmodel.contract;

public class CloseContractVM
{
    public int ContractID { get; set; }
    public int EndMileage { get; set; }
    public int EndFuelReading { get; set; }
    public string? Remarks { get; set; }
    public string? Discount { get; set; }
    public string? TotalAmount { get; set; }
    public string? TaxAmount { get; set; }

    //Closing Contracts Charges
    public string? ExcessiveCleaning { get; set; }
    public string? DamageCharges { get; set; }
    public string? MissingAccessory { get; set; }
    public string? ExcessMilage { get; set; }
    public string? LateReturn { get; set; }
    public string? FuelAdjustment { get; set; }
    public IFormFile? Signature { get; set; }

}
