namespace presentation.viewmodel.contract;

public class ContractBriefVM
{
    public int ID { get; set; }
    public string? contractCode { get; set; }
    public string? vehicle { get; set; }
    public string? client { get; set; }
    public DateTime start { get; set; }
     public DateTime end { get; set; }
     public decimal amount { get; set; }
    public string? status { get; set; }

}