using DataAccess.Models;

namespace Service.TransferModels.Requests.Create;

    public class CreateOrderDto
    {
        public DateTime OrderDate { get; set; }
        public DateOnly? DeliveryDate { get; set; }
        public string Status { get; set; } = null!;
        public double TotalAmount { get; set; }
        public int? CustomerId { get; set; }

        public Order ToOrder()
        {
            return new Order
            {
                OrderDate = OrderDate,
                DeliveryDate = DeliveryDate,
                Status = Status,
                TotalAmount = TotalAmount,
                CustomerId = CustomerId
            };
        }
    }
