using DataAccess;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Mappers;


namespace Service;


public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetCustomers();
    Task<CustomerDto?> GetCustomerById(int id);
    Task<CustomerDto> AddCustomer(Customer customer);
    Task UpdateCustomer(Customer customer);
    Task DeleteCustomer(int id);
    Task AddOrderToCustomer(int customerId, Order order);
    Task<IEnumerable<CustomerDto>> GetCustomersWithOrders();
}

// As a customer I want to be able to see my own order history.
// This involves retrieving the order history for a specific customer.

public class CustomerService(DunderMifflinContext context, ILogger<CustomerService> logger) : ICustomerService
{

    public async Task<CustomerDto> AddCustomer(Customer customer)
    {
        context.Customers.Add(customer);
        await context.SaveChangesAsync();
        return customer.ToDto();
    }
    
    
    public async Task AddOrderToCustomer(int customerId, Order order)
    {
        var customer = await context.Customers.FindAsync(customerId);
        
        if (customer == null)
        {
            var message = $"Customer with ID {customerId} not found.";
            logger.LogError("Error in AddOrderToCustomerAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }
        customer.Orders.Add(order);
        await context.SaveChangesAsync();
    }
    
    
    public async Task<IEnumerable<CustomerDto>> GetCustomers()
    {
        var customers = await context.Customers.ToListAsync();
        return customers.Select(c => c.ToDto());

    }

    public async Task<CustomerDto?> GetCustomerById(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer != null)
        {
            return customer.ToDto();
        }
        {
            var message = $"Customer with ID:{id} Not Found";
            logger.LogError("Error in GetCustomerByIdAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    
    public async Task<IEnumerable<CustomerDto>> GetCustomersWithOrders()
    {
        var customers = await context.Customers
            .Include(c => c.Orders)
            .Where(c => c.Orders.Count > 0)
            .ToListAsync();
        return customers.Select(c => c.ToDto());
    }
    

    public async Task UpdateCustomer(Customer customer)
    {
        context.Entry(customer).State = EntityState.Modified;
        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (CustomerExistsAsync(customer.Id))
            {
                logger.LogError("Concurrency error in UpdateCustomer for Customer ID {OrderId}", customer.Id);
                throw;
            }
            var message = $"Customer with ID {customer.Id} not found.";
            logger.LogError("Error in UpdateCustomerAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    
    private bool CustomerExistsAsync(int id)
    {
        return context.Customers.Any(c => c.Id == id);
    }

    public async Task DeleteCustomer(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer == null)
        {
            var message = $"Customer with ID {id} not found.";
            logger.LogError("Error in DeleteCustomerAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        context.Customers.Remove(customer);
        await context.SaveChangesAsync();

    }
    
}