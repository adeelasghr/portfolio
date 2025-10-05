using System.ComponentModel.DataAnnotations;

namespace core.entities.vehicle;

public class VehicleGroup : BaseEntity
{
    [Key]
    public int GroupID { get; set; }
    public string? GroupIntName { get; set; }
    public string? GroupExtName { get; set; }
}
