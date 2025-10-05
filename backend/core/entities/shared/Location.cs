namespace core.entities.shared;

public class Location : BaseEntity
{
    public int LocationID { get; set; }
    public string? LocationName { get; set; }
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }

}