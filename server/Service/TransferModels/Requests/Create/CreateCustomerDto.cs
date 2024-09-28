using DataAccess.Models;

namespace Service.TransferModels.Requests.Create;

    public class CreateCustomerDto
    {
        public string Name { get; set; } = null!;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }

        public Customer ToCustomer()
        {
            return new Customer
            {
                Name = Name,
                Address = Address,
                Phone = Phone,
                Email = Email
            };
        }
    }
