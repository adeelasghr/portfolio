using System.ComponentModel.DataAnnotations.Schema;
using core.entities;

[Table("VehicleBrand")]
public class VehicleBrand : BaseEntity
{
    public int VehicleBrandID { get; set; }
    public string? Name { get; set; }
}