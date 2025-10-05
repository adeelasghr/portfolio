using System.ComponentModel.DataAnnotations.Schema;
using core.entities;

[Table("VehicleType")]
public class VehicleType : BaseEntity
{
    public int VehicleTypeID { get; set; }
    public string? Name { get; set; }
}
