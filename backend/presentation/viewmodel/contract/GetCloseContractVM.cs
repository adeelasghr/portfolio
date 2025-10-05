namespace presentation.viewmodel.contract;

public class GetCloseContractVM
{
    public string? ContractCode { get; set; }
    public int StartMileage { get; set; }
    public DateTime DropOffDateTime { get; set; }
    public string? FuelCoverage { get; set; }
    public int KMAllowed { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal SecurityDeposit { get; set; }
}
