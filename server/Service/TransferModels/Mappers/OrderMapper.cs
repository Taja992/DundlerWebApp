using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.TransferModels.Mappers;

    public static class OrderMapper
    {
        // ToDto coverts Order to OrderDto
        public static OrderDto ToDto(this Order order)
        {
            return new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                DeliveryDate = order.DeliveryDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                CustomerId = order.CustomerId
            };
        }

        // ToEntity converts OrderDto to Order
        public static Order ToEntity(this OrderDto orderDto)
        {
            return new Order
            {
                Id = orderDto.Id,
                OrderDate = orderDto.OrderDate,
                DeliveryDate = orderDto.DeliveryDate,
                Status = orderDto.Status,
                TotalAmount = orderDto.TotalAmount,
                CustomerId = orderDto.CustomerId
            };
        }
    }
