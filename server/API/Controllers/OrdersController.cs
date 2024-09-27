using Microsoft.AspNetCore.Mvc;
using DataAccess.Models;
using Service;


namespace API.Controllers;



[ApiController]
[Route("[controller]")]
public class OrdersController(IOrderService service) : ControllerBase
{
    // Create an Order
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
    {
        var createdOrder = await service.CreateOrder(order);
        return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
    }

    // Get All Orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var orders = await service.GetOrders();
        return Ok(orders);
    }

    // Get orders via Id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await service.GetOrder(id);
        
        if (order == null)
        {
            return NotFound();
        }

        return order;
    }
    
    // Get Orders Via Customer Id
    [HttpGet("Customer/{customerId:int}")]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrdersByCustomerId(int customerId)
    {
        var customer = await service.GetOrdersByCustomerId(customerId);
        return Ok(customer);
    }
    
    // Update Order Info
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
    {
        if (id != order.Id)
        {
            return BadRequest();
        }

        try
        {
            await service.UpdateOrder(id, order);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        return NoContent();
    }


    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        try
        {
            await service.DeleteOrder(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
    
}