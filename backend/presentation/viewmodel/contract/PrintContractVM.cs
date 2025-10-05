using presentation.viewmodel.shared;

namespace presentation.viewmodel.contract;

public class PrintContractVM
{
    public string? ContractCode { get; set; }
    public int VehicleID { get; set; }
    public string? VehiclCode { get; set; }
    public string? VehicleName { get; set; }  // Brand + Model
    public string? PetrolType { get; set; }
    public int FuelReading { get; set; }
    public string? Group { get; set; }
    public string? CustomerCode { get; set; }
    public string? CustomerName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public int PickupLocID { get; set; }
    public DateTime PickDateTime { get; set; }
    public int DropOffLocID { get; set; }
    public DateTime DropDateTime { get; set; }
    // Inspection
    public decimal DailyRent { get; set; }
    public int TotalDays { get; set; }
    public decimal TotalRentals { get; set; }
    public decimal? AdditionalCharges { get; set; }
    public decimal? OtherCharges { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal? SecurityDeposit { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Discount { get; set; }
    public string? Signature { get; set; }
    public string? Status { get; set; }
    public string? UserName { get; set; }
    public string? UserCode { get; set; }
    public DateTime CreatedOn { get; set; }
    public List<AddOnsVM>? AddOns { get; set; } 
}