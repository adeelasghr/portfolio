using presentation.viewmodel.shared;

namespace presentation.viewmodel.contract;

public class ContractTimelineVM
{
    public string? ContractCode { get; set; }
    public int PickupLocID { get; set; }
    public int DropOffLocID { get; set; }
    public DateTime PickupDateTime { get; set; }
    public DateTime DropOffDateTime { get; set; }
    public decimal TotalAmount { get; set; }
    public string? Status { get; set; }
    public string? CustomerName { get; set; }
    public string? VehicleName { get; set; }
    public List<TimelineVM>? Timeline { get; set; }

}