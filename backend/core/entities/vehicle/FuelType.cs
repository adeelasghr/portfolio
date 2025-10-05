using System.ComponentModel.DataAnnotations.Schema;
using core.entities;
using core.entities.vehicle;

[Table("FuelType")]
public class FuelType : BaseEntity
{
    public int FuelTypeID { get; set; }
    public string? Name { get; set; }

}
