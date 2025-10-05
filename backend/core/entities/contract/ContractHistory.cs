using System.ComponentModel.DataAnnotations;

namespace core.entities.contract;

public class ContractHistory
{
    [Key]
    public int CHistoryID { get; set; }

    public DateTime PickupDateTime { get; set; }
    public DateTime DropOffDateTime { get; set; }
    public string? Status { get; set; }
    public string? Insurance { get; set; }
    public int? startFuelReading { get; set; }
    public int? endFuelReading { get; set; }
    public int? StartMileage { get; set; }
    public int? EndMileage { get; set; }
    public decimal DailyRent { get; set; }
    public int TotalDays { get; set; }
    public decimal TotalRentals { get; set; }
    public decimal AdditionalCharges { get; set; }
    public decimal OtherCharges { get; set; }
    public decimal Deposit { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public string? Reference { get; set; }
    public string? Remarks { get; set; }
    public int ChangedBy { get; set; }
    public DateTime ChangedAt { get; set; }
    
    // Foriegn Keys
    public int BookingID { get; set; }
    public int PickupLocID { get; set; }
    public int DropOffLocID { get; set; }
    public int VehicleID { get; set; }
    public int CustomerID { get; set; }
    public int ContractID { get; set; }
}
