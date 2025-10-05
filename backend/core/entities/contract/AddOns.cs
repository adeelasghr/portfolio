using System.ComponentModel.DataAnnotations;

namespace core.entities.contract;

public class AddOns : BaseEntity
{
    [Key]
    public int AddOnID { get; set; }
    public string? AddOnCode { get; set; }
    public string? AddOnName { get; set; }
    public int Price { get; set; }
    public string? Deatils { get; set; }
    public string? Image { get; set; }
}