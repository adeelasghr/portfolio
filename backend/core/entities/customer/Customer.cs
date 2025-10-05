using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace core.entities.client;

[Table("Customer")]
public class Customer : BaseEntity
{
  [Key]
  public int CustomerID { get; set; }
  [Required]
  public string CustomerCode { get; set; } = string.Empty;
  public string Status { get; set; } = "Active";

  //Personal Details
  [Required]
  [MaxLength(50)]
  public string FirstName { get; set; } = string.Empty;
  public string? LastName { get; set; }
  [Required]
  [MaxLength(50)]
  public string Email { get; set; } = string.Empty;
  public DateTime DOB { get; set; }
  public string? PhoneNumber { get; set; }
  public string Picture { get; set; } = string.Empty;
  public string HashKey { get; set; } = string.Empty;

  //Address Details
  public string? StreetName { get; set; }
  public string? HouseNo { get; set; }
  public string PostalCode { get; set; } = "00000";
  public string? City { get; set; }
  public string? Country { get; set; }
  public string? AdditionalInfo { get; set; } = "";
  public string? AccountType { get; set; }

  //Identification Details
  public string PassportNo { get; set; } = string.Empty;
  public DateTime? PassportIssue { get; set; }
  public DateTime? PassportExpiry { get; set; }
  public string? IDCardNo { get; set; }
  public DateTime? IDCardIssue { get; set; }
  public DateTime? IDCardExpiry { get; set; }
  [Required]
  public string LicenseNo { get; set; } = string.Empty;
  [Required]
  public DateTime LicenseIssue { get; set; }
  [Required]
  public DateTime LicenseExpiry { get; set; }

  // One to many relationship
  public ICollection<CustomerDoc>? CustomerDocs { get; set; }

}