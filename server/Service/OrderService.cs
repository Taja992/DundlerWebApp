using DataAccess;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;


namespace Service;



public interface IOrderService
{
    Task<Order> CreateOrder(Order order);
    Task<IEnumerable<Order>> GetOrders();
    Task<Order?> GetOrder(int id);
    Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId);
    Task UpdateOrder(int id, Order order);
    Task DeleteOrder(int id);
}

public class OrderService(DunderMifflinContext context, ILogger<CustomerService> logger) : IOrderService
{
    //     As a customer I want to be able to place an order with X order entries of products.
    //     This involves creating a new order with multiple order entries.
    
    //     As a business admin I want to see order history for all customers.
    //     This involves retrieving the order history for all customers.
    
    //     As a business admin I want to be able to change the status of an order.
    //     This involves updating the status of an existing order.
    public async Task<Order> CreateOrder(Order order)
    {
        context.Orders.Add(order);
        await context.SaveChangesAsync();
        return order;
    }
    

    public async Task<IEnumerable<Order>> GetOrders()
    {
        return await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .ToListAsync();
    }

    public async Task<Order?> GetOrder(int id)
    {
        return await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId)
    {
        return await context.Orders.Where(o => o.CustomerId == customerId)
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .ToListAsync();
    }

    public async Task UpdateOrder(int id, Order order)
    {
        context.Entry(order).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (OrderExists(id))
            {
                logger.LogError("Concurrency error in UpdateOrder for order ID {OrderId}", order.Id);
                throw;
            }
            var message = $"Order with ID {id} not found.";
            logger.LogError("Error in UpdateOrder: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }

    private bool OrderExists(int id)
    {
        return context.Orders.Any(e => e.Id == id);
    }

    public async Task DeleteOrder(int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order == null)
        {
            var message = $"Order with ID {id} not found.";
            logger.LogError("Error in DeleteOrder: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        context.Orders.Remove(order);
        await context.SaveChangesAsync();
    }
}

