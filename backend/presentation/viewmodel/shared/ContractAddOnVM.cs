namespace presentation.viewmodel.shared;

public class ContractAddOnVM
{
    public int ID { get; set; }
    public string? Name { get; set; }
    public decimal Price { get; set; }
}

public class ContractEditAddOnVM
{
    public int ID { get; set; }
    public decimal Price { get; set; }
    public string? Name { get; set; }
    public string? KMs { get; set; }
}

