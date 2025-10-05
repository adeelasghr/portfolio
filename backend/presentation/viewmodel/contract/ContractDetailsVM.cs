using presentation.viewmodel.shared;

namespace presentation.viewmodel.contract;

public class ContractDetailsVM
{
    public int ContractID { get; set; }
    public string? ContractCode { get; set; }
    public string? PickupDate { get; set; }
    public string? DropOffDate { get; set; }
    public string? PickupTime { get; set; }
    public string? DropOffTime { get; set; }
    public int PickupLocID { get; set; }
    public int DropOffLocID { get; set; }
    public string? ContractDate { get; set; }
    public string? ClientName { get; set; }
    public int VehicleID { get; set; }
    public int VehicleTypeID { get; set; }
    public string? Insurance { get; set; }
    public string? Reference { get; set; }
    public string? Remarks { get; set; }
    public decimal OtherCharges { get; set; }
    public decimal Deposit { get; set; }
    public decimal TotalRentals { get; set; }
    public decimal AdditionalCharges { get; set; }
    public decimal DailyRent { get; set; }
    public decimal TotalAmount { get; set; }
    public int TotalDays { get; set; }
    public ICollection<ContractEditAddOnVM>? AddOns { get; set; }
}