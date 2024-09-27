namespace Service.TransferModels.DTOs;

public class CustomerDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Address { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public List<OrderDto> Orders { get; set; } = new();
}