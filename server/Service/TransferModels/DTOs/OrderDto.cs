using DataAccess.Models;


namespace Service.TransferModels.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public DateTime OrderDate { get; set; }
    public DateOnly? DeliveryDate { get; set; }
    public string Status { get; set; } = null!;
    public double TotalAmount { get; set; }
    public int? CustomerId { get; set; }
    public CustomerDto? Customer { get; set; }
    public List<OrderEntryDto> OrderEntries { get; set; } = new();

    public OrderDto FromEntity(Order order, bool includeCustomer = true)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            DeliveryDate = order.DeliveryDate,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            CustomerId = order.CustomerId,
            // If includeCustomer is true, convert Customer to CustomerDto, otherwise set to null
            Customer = includeCustomer && order.Customer != null ? new CustomerDto().FromEntity(order.Customer, false) : null,
            OrderEntries = order.OrderEntries.Select(oe => new OrderEntryDto().FromEntity(oe)).ToList()
        };
    }

    public Order ToOrder()
    {
        return new Order
        {
            Id = Id,
            OrderDate = OrderDate,
            DeliveryDate = DeliveryDate,
            Status = Status,
            TotalAmount = TotalAmount,
            CustomerId = CustomerId,
            OrderEntries = OrderEntries.Select(oe => oe.ToOrderEntry()).ToList()
        };
    }
}
