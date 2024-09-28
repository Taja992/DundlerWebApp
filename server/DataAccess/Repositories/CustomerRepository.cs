using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class CustomerRepository(DunderMifflinContext context) : ICustomerRepository
{
    
    public async Task<Customer> AddCustomer(Customer customer)
    {
        context.Customers.Add(customer);
        await context.SaveChangesAsync();
        return customer;
    }
    
    public async Task AddOrderToCustomer(int customerId, Order order)
    {
        var customer = await context.Customers.FindAsync(customerId);
        if (customer != null)
        {
            customer.Orders.Add(order);
            await context.SaveChangesAsync();
        }
    }
    
    public async Task<IEnumerable<Customer>> GetAllCustomers()
    {
        return await context.Customers.ToListAsync();
    }

    public async Task<Customer?> GetCustomerById(int id)
    {
        return await context.Customers.FindAsync(id);
    }
    
    public async Task<IEnumerable<Customer>> GetCustomersWithOrders()
    {
        return await context.Customers
            .Include(c => c.Orders)
            .Where(c => c.Orders.Count > 0)
            .ToListAsync();
    }
    

    public async Task UpdateCustomer(Customer customer)
    {
        context.Entry(customer).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }
    
    
    public async Task DeleteCustomer(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer != null)
        {
            context.Customers.Remove(customer);
            await context.SaveChangesAsync();
        }
    }
    
}