using DataAccess.Models;

namespace Service.TransferModels.Requests.Update;

    public class UpdateOrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public DateOnly? DeliveryDate { get; set; }
        public string Status { get; set; } = null!;
        public double TotalAmount { get; set; }
        public int? CustomerId { get; set; }

        public Order ToOrder()
        {
            return new Order
            {
                Id = Id,
                OrderDate = OrderDate,
                DeliveryDate = DeliveryDate,
                Status = Status,
                TotalAmount = TotalAmount,
                CustomerId = CustomerId
            };
        }
        
        
    }
