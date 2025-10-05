using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace core.entities.vehicle;

[Table("VehicleImage")]
public class VehicleImage : BaseEntity
{
    [Key]
    public int VehicleImageId { get; set; }
    [Required]
    public string? FileName { get; set; }

    public string? FilePath { get; set; }

    // Foreign key
    public int VehicleID { get; set; }
    public Vehicle? Vehicle { get; set; }
}