namespace core.entities.shared;

public class City : BaseEntity
{
    public int CityID { get; set; }
    public string? CityName { get; set; }
    public int CountryID { get; set; }
    public Country? Country { get; set; }
}
