using presentation.viewmodel.shared;

namespace presentation.viewmodel.vehicles;

public class VehicleDetailsVM
{
    //Personal Details
    public int ID { get; set; }
    public string? Code { get; set; }
    public string? PlateNumber { get; set; }
    public int Year { get; set; }
    public decimal DailyRate { get; set; }
    public bool AC { get; set; }
    public int NoOfSeats { get; set; }
    public string? Color { get; set; }
    public int Mileage { get; set; }
    public int Luggage { get; set; }
    public string? Features { get; set; }
    public bool ShowOnWebsite { get; set; }
    public string? Type { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Group { get; set; }
    public string? Transmission { get; set; }
    public string? FuelType { get; set; }
    public string? Status { get; set; }
    public DateTime CreatedOn { get; set; }

    public List<VehicleImageVM>? VehicleImages { get; set; }
    public List<InspectionBriefVM>? Inspections { get; set; }

}