using DataAccess.Models;


namespace Service.TransferModels.DTOs;

    public class OrderEntryDto
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int? ProductId { get; set; }
        public int? OrderId { get; set; }
        public OrderDto? Order { get; set; }
        public PaperDto? Product { get; set; }

        public OrderEntryDto FromEntity(OrderEntry orderEntry)
        {
            return new OrderEntryDto
            {
                Id = orderEntry.Id,
                Quantity = orderEntry.Quantity,
                ProductId = orderEntry.ProductId,
                OrderId = orderEntry.OrderId,
                Order = orderEntry.Order != null ? new OrderDto().FromEntity(orderEntry.Order) : null,
                Product = orderEntry.Product != null ? new PaperDto().FromEntity(orderEntry.Product) : null
            };
        }
        
        public OrderEntry ToOrderEntry()
        {
            return new OrderEntry
            {
                ProductId = ProductId,
                Quantity = Quantity
            };
        }
    }
