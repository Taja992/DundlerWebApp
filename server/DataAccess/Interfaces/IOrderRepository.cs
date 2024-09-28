using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IOrderRepository
{
    Task<Order> CreateOrder(Order order);
    Task<IEnumerable<Order>> GetOrders();
    Task<Order?> GetOrder(int id);
    Task<IEnumerable<Order>> GetOrdersByCustomerId(int customerId);
    Task UpdateOrder(Order order);
    Task DeleteOrder(int id);

}

