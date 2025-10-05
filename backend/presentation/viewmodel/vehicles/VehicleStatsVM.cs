namespace presentation.viewmodel.vehicles;

public class VehicleStatsVM
{
    public int VehicleID { get; set; }
    public string? VehicleCode { get; set; }
    public string? Status { get; set; }
    public int TotalContracts { get; set; }
    public string? NextSchedule { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpense { get; set; }
}