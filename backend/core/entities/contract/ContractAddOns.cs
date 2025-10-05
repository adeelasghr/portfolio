namespace core.entities.contract;

public class ContractAddOns : BaseEntity
{
    public int ContractAddOnsID { get; set; }
    public decimal AddOnsPrice { get; set; }
    public string? AddOnDetail { get; set; }
    public int ContractID { get; set; }
    public Contract? Contract { get; set; } 
    public int AddOnsID { get; set; }
    public AddOns? AddOns { get; set; }    
}