using DataAccess.Models;

namespace Service.TransferModels.Requests.Update;

    public class UpdateCustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }

        public Customer ToCustomer()
        {
            return new Customer
            {
                Id = Id,
                Name = Name,
                Address = Address,
                Phone = Phone,
                Email = Email
            };
        }
    }
