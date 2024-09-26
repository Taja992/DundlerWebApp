using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;
using Service.Models;

namespace API.Controllers;



[ApiController]
[Route("[controller]")]
public class OrdersController(DunderMifflinContext context) : ControllerBase
{
    // Create an Order
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
    {
        context.Orders.Add(order);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
    }

    // Get All Orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .ToListAsync();
    }

    // Get orders via Id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await context.Orders
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound();
        }

        return order;
    }
    
    // Get Orders Via Customer Id
    [HttpGet("Customer/{customerId}")]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByCustomerId(int customerId)
    {
        return await context.Orders.Where(o => o.CustomerId == customerId)
            .Include(o => o.Customer)
            .Include(o => o.OrderEntries)
            .ToListAsync();
    }
    
    // Update Order Info
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOrder(int id,[FromBody] Order order)
    {
        if (id != order.Id)
        {
            return BadRequest();
        }

        context.Entry(order).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OrderExists(id))
            {
                return NotFound();
            }
            {
                throw;
            }
        }
        
        return NoContent();
    }
    // Used above in Update to check if the order still exists to stop concurrency issues
    private bool OrderExists(int id)
    {
        return context.Orders.Any(e => e.Id == id);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound();
        }

        context.Orders.Remove(order);
        await context.SaveChangesAsync();

        return NoContent();
    }
    
}