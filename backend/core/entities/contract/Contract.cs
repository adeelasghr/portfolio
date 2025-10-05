using System.ComponentModel.DataAnnotations.Schema;
using core.entities.client;
using core.entities.user;
using core.entities.vehicle;

namespace core.entities.contract;

public class Contract : BaseEntity
{
    public int ContractID { get; set; }
    public string? ContractCode { get; set; }
    public DateTime PickupDateTime { get; set; }
    public DateTime DropOffDateTime { get; set; }
    public string? Status { get; set; }
    public string? Insurance { get; set; }
    public string? signatures { get; set; }
    public string? ClosingSignatures { get; set; }
    public int? startFuelReading { get; set; }
    public int? endFuelReading { get; set; }
    public int? StartMileage { get; set; }
    public int? EndMileage { get; set; }
    // Finance
    public decimal DailyRent { get; set; }
    public int TotalDays { get; set; }
    public decimal TotalRentals { get; set; }
    public decimal AdditionalCharges { get; set; }
    public decimal OtherCharges { get; set; }
    public decimal Deposit { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal Discount { get; set; } = 0;
    public string? Reference { get; set; }
    public string? Remarks { get; set; }
    // Foriegn Keys
    public int BookingID { get; set; }
    public int PickupLocID { get; set; }
    public int DropOffLocID { get; set; }
    public int VehicleID { get; set; }
    public Vehicle? Vehicle { get; set; }
    public int CustomerID { get; set; }
    public Customer? Customer { get; set; }
    
    [ForeignKey("UserID")]
    public Users? Users { get; set; }
    public ICollection<ContractAddOns>? AddOns { get; set; }
    public ICollection<ContractFinance>? Finances { get; set; }
    public ICollection<ContractHistory>? History { get; set; }
}