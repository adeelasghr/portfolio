using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using core.entities;
using core.entities.client;

[Table("CustomerDoc")]
public class CustomerDoc : BaseEntity
{
    [Key]
    public int CustomerDocId { get; set; }

    [Required]
    public string? FileName { get; set; }

    public string? FilePath { get; set; }

    // Foreign key
    public int CustomerID { get; set; }
    public Customer? Customer { get; set; }
}
