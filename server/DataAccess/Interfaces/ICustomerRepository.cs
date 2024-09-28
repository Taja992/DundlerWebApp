using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface ICustomerRepository
{
    Task<IEnumerable<Customer>> GetAllCustomers();
    Task<Customer?> GetCustomerById(int id);
    Task<Customer> AddCustomer(Customer customer);
    Task UpdateCustomer(Customer customer);
    Task DeleteCustomer(int id);
    Task AddOrderToCustomer(int customerId, Order order);
    Task<IEnumerable<Customer>> GetCustomersWithOrders();
}