namespace presentation.viewmodel.vehicles;

public class UpdateVehicleVM
{
    //Personal Details
    public int ID { get; set; }
    public string? PlateNumber { get; set; }
    public int Year { get; set; }
    public decimal DailyRate { get; set; }
    public bool AC { get; set; }
    public int NoOfSeats { get; set; }
    public string? Color { get; set; }
    public int Mileage { get; set; }
    public int Luggage { get; set; }
    public string? Insurance { get; set; }
    public bool ShowOnWebsite { get; set; }
    public int VehicleTypeID { get; set; }
    public int BrandID { get; set; }
    public int VehicleModelID { get; set; }
    public int TransmissionID { get; set; }
    public int FuelTypeID { get; set; }

}