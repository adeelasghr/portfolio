namespace presentation.viewmodel.contract;

public class ContractOverviewVM
{
    public int PickupLocID { get; set; }
    public int DropOffLocID { get; set; }
    public string? ContractCode { get; set; }
    public DateTime PickupDateTime { get; set; }
    public DateTime DropOffDateTime { get; set; }
    public decimal TotalAmount { get; set; }
    public string? VehicleCode { get; set; }
    public string? VehicleName { get; set; }
    public string? CustomerCode { get; set; }
    public string? CustomerName { get; set; }
}