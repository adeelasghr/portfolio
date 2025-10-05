namespace presentation.viewmodel.contract;

public class GetEditClosedContractVM
{
    public int ContractID { get; set; }
    public string? ContractCode { get; set; }
    public decimal SecurityDeposit { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal ExcessiveCleaning { get; set; }
    public decimal DamageCharges { get; set; }
    public decimal MissingAccessory { get; set; }
    public decimal ExcessMilage { get; set; }
    public decimal LateReturn { get; set; }
    public decimal FuelAdjustment { get; set; }
    public decimal AdditionalCharges { get; set; }
}
