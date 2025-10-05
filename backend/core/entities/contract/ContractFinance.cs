namespace core.entities.contract;

public class ContractFinance : BaseEntity
{
    public int ContractFinanceID { get; set; }
    public decimal Amount { get; set; }
     public int Quantity { get; set; }
    public int ContractID { get; set; }
    public decimal Total { get; set; }
    public string? Remarks { get; set; }
    public Contract? Contract { get; set; }
    public int FinanceItemID { get; set; }
}