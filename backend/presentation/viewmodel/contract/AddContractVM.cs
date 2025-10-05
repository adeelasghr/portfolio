using Microsoft.AspNetCore.Http;
using presentation.viewmodel.shared;

namespace presentation.viewmodel.contract;

public class AddContractVM
{
    public int PickUpLocID { get; set; }
    public int DropOffLocID { get; set; }
    public DateTime? PickUpDateTime { get; set; }
    public DateTime? DropOffDateTime { get; set; }
    public int VehicleTypeID { get; set; }
    public int VehicleID { get; set; }
    public int BookingID { get; set; } = 0;
    public int ClientID { get; set; } = 0;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? DOB { get; set; }
    public string? PassportNo { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? LicenseNo { get; set; }
    public string? LicenseExpiry { get; set; }
    public string? Insurance { get; set; }
    public string? SecurityDeposit { get; set; }
    public string? AdditionalCharges { get; set; }
    public string? Reference { get; set; }
    public string Remarks { get; set; } = "";
    public string? OtherCharges { get; set; }
    public int TotalDays { get; set; }
    public string? DailyRent { get; set; }
    public string? TotalAmount { get; set; }
    public string? TotalRentals { get; set; } 
    public IFormFile? Signature { get; set; }

    public int? startFuelReading { get; set; }
    public int? endFuelReading { get; set; }
    public int? StartMileage { get; set; }
    public int? EndMileage { get; set; }

    // Supporting Fields, will be merged on Mapping
    public string? PickUpDate { get; set; }
    public string? DropOffDate { get; set; }
    public string? PickUpTime { get; set; }
    public string? DropOffTime { get; set; }
    public int UserID { get; set; }

    public List<ContractAddOnVM> AddOns { get; set; } = new List<ContractAddOnVM>();

}