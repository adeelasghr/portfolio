namespace presentation.viewmodel.shared;

public class InspectionVM
{
    public int InspectionID { get; set; }
    public string? InspectionType { get; set; }
    public string? Remarks { get; set; }
    public string? InspectionImage { get; set; }
    public DateTime InspectionDate { get; set; }
    public string? DamageCategoryName { get; set; }
    public string? VehiclePartName { get; set; }
    public string? DamageLocationName { get; set; }
}

public class InspectionBriefVM
{
    public string? Image { get; set; }
    public string? Remarks { get; set; }
    public DateTime Date { get; set; }
}