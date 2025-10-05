using Microsoft.AspNetCore.Http;
namespace presentation.viewmodel.shared;

public class AddAddOnsVM
{
    public string? AddOnName { get; set; }
    public int Price { get; set; }
    public string? Deatils { get; set; }
    public IFormFile? Image { get; set; }
}