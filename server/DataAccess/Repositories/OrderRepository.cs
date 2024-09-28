using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class OrderRepository(DunderMifflinContext context) : IOrderRepository
{
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
        return await context.Orders
            .Where(o => o.CustomerId == customerId)
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .ToListAsync();
    }

    public async Task UpdateOrder(Order order)
    {
        context.Entry(order).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }

    public async Task DeleteOrder(int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order != null)
        {
            context.Orders.Remove(order);
            await context.SaveChangesAsync();
        }

    }
    
}