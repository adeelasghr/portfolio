using System.ComponentModel.DataAnnotations.Schema;
using core.entities;

[Table("Transmission")]
public class Transmission : BaseEntity
{
    public int TransmissionID { get; set; }
    public string? Name { get; set; }
}
