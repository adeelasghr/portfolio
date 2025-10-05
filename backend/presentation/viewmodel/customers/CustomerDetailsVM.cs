namespace presentation.viewmodel.customers;

public class CustomerDetailsVM
{
    public string? CustomerCode { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public DateTime DOB { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Picture { get; set; }
    //Address Details
    public string? StreetName { get; set; }
    public string? HouseNo { get; set; }
    public string? PostalCode { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? AdditionalInfo { get; set; }
    //Identification Details
    public string? PassportNo { get; set; }
    public DateTime? PassportIssue { get; set; }
    public DateTime? PassportExpiry { get; set; }
    public string? IDCardNo { get; set; }
    public DateTime? IDCardIssue { get; set; }
    public DateTime? IDCardExpiry { get; set; }
    public string? LicenseNo { get; set; }
    public DateTime? LicenseIssue { get; set; }
    public DateTime? LicenseExpiry { get; set; }

    public DateTime? CreatedAt { get; set; }

    public List<string>? CustomerDocs { get; set; }

}