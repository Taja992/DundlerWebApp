using DataAccess.Models;
using System;

namespace Service.TransferModels.Requests.Create
{
    public class CreateOrderEntryDto
    {
        public int Quantity { get; set; }
        public int? ProductId { get; set; }
        public int? OrderId { get; set; }

        public OrderEntry ToOrderEntry()
        {
            return new OrderEntry
            {
                Quantity = Quantity,
                ProductId = ProductId,
                OrderId = OrderId
            };
        }
    }
}