namespace presentation.viewmodel.vehicles;

public class VehicleHistoryVM
{
    public int VehicleID { get; set; }
    public string? VehicleCode { get; set; }
    public string? VehicleName { get; set; }
    public string? PlateNumber { get; set; }
    public DateTime CreatedOn { get; set; }
    public decimal DailyRate { get; set; }
    public string? VehicleType { get; set; }
    public string? FuelType { get; set; }
    public string? Group { get; set; }
    public string? Status { get; set; }
    public string? VehicleImage { get; set; }

    public List<VehicleHistoryItemVM> History { get; set; } = new();
    
}