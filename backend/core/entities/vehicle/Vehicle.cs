using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace core.entities.vehicle;

[Table("Vehicle")]
public class Vehicle : BaseEntity
{
    [Key]
    public int VehicleID { get; set; }
    [Required]
    public string VehicleCode { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
    public int Year { get; set; }
    public string? PlateNumber { get; set; }
    public decimal DailyRate { get; set; }
    public string? Features { get; set; }
    public bool AC { get; set; }
    public int NoOfSeats { get; set; }
    public string? Color { get; set; }
    public int Mileage { get; set; }
    public int Luggage { get; set; }
    public bool ShowOnWebsite { get; set; }
    //Foreign Keys
    public int GroupID { get; set; }
    [ForeignKey("GroupID")]
    public VehicleGroup? VehicleGroup { get; set; }
    public int VehicleTypeID { get; set; }
    public VehicleType? VehicleType { get; set; }
    public int BrandID { get; set; }
    public VehicleBrand? Brand { get; set; }
    public int VehicleModelID { get; set; }
    public VehicleModel? Model { get; set; }
    public int TransmissionID { get; set; }
    public Transmission? Transmission { get; set; }
    public int FuelTypeID { get; set; }
    public FuelType? FuelType { get; set; }
    
    public ICollection<VehicleImage>? VehicleImages { get; set; }
    public ICollection<VehicleHistory>? VehicleHistory { get; set; }
}