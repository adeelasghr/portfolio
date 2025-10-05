namespace core.entities.contract;

public class ContractAddOnsHistory
{
    public int ContractAddOnsHistoryID { get; set; }
    public decimal AddOnsPrice { get; set; }
    public string? AddOnDetail { get; set; }
    public int AddOnsID { get; set; }
    public int CHistoryID { get; set; }
}