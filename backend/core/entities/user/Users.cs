using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace core.entities.user;

public class Users : BaseEntity
{
    [Key]
    public new int UserID { get; set; }
    public string? UserCode { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string HashKey { get; set; } = string.Empty;
    public string? Status { get; set; }
    public string? Roles { get; set; }
}