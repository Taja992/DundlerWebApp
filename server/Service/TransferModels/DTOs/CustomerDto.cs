using AutoMapper;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.TransferModels.DTOs;

    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public List<OrderDto> Orders { get; set; } = new();

        // Converts from Customer to CustomerDto
        //we use the include orders flag to prevent the orderDto and CustomerDto 
        //from looping on eachother and causing a stack overflow
        //when converting a Customer to a customerDto we set include orders to false
        
        public CustomerDto FromEntity(Customer customer, IMapper mapper)
        {
            return mapper.Map<CustomerDto>(customer);
        }
        
        // public CustomerDto FromEntity(Customer customer, bool includeOrders = true)
        // {
        //     return new CustomerDto
        //     {
        //         Id = customer.Id,
        //         Name = customer.Name,
        //         Address = customer.Address,
        //         Phone = customer.Phone,
        //         Email = customer.Email,
        //         // If includeOrders is true, convert Orders to OrderDto, otherwise leave it empty
        //         Orders = includeOrders ? customer.Orders.Select(o => new OrderDto().FromEntity(o, false)).ToList() : new List<OrderDto>()
        //     };
        // }
    }
