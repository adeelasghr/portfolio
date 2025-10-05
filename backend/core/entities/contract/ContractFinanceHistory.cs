namespace core.entities.contract;

public class ContractFinanceHistory
{
    public int ContractFinanceHistoryID { get; set; }
    public decimal Amount { get; set; }
    public int Quantity { get; set; }
    public int CHistoryID { get; set; }
    public int ContractItemID { get; set; }
    public string? Remarks { get; set; }
}