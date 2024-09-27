using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.TransferModels.Mappers
{
    public static class CustomerMapper
    {
        // ToDto coverts Customer to CustomerDto
        public static CustomerDto ToDto(this Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Address = customer.Address,
                Phone = customer.Phone,
                Email = customer.Email,
                Orders = customer.Orders.Select(o => o.ToDto()).ToList()
            };
        }
        // ToEntity CustomerDto > Customer
        public static Customer ToEntity(this CustomerDto customerDto)
        {
            return new Customer
            {
                Id = customerDto.Id,
                Name = customerDto.Name,
                Address = customerDto.Address,
                Phone = customerDto.Phone,
                Email = customerDto.Email,
                Orders = customerDto.Orders.Select(o => o.ToEntity()).ToList()
            };
        }
    }
}