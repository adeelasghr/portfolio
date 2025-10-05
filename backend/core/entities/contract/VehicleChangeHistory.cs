namespace core.entities.contract;

public class VehicleChangeHistory : BaseEntity
{
    public int VehicleChangeHistoryID { get; set; }
    public int ContractID { get; set; }
    public int VehicleID { get; set; }
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public int TotalDays { get; set; }
    public decimal DailyRate { get; set; }
}
