namespace core.entities.vehicle;

public class VehicleHistory : BaseEntity
{
    public int VehicleHistoryID { get; set; }
    public string? EventType { get; set; } // e.g., "Maintenance", "Contract", "Inspection"
    public string? EventDescription { get; set; }
    public int VehicleID { get; set; }
    public Vehicle? Vehicle { get; set; }
}