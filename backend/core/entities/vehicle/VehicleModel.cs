using System.ComponentModel.DataAnnotations.Schema;
using core.entities;

[Table("VehicleModel")]
public class VehicleModel : BaseEntity
{
    public int VehicleModelID { get; set; }
    public string? Name { get; set; }
    public int BrandID { get; set; }

}
