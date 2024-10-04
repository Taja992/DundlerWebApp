using Microsoft.AspNetCore.Mvc;
using DataAccess.Models;
using Service;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;


namespace API.Controllers;



[ApiController]
[Route("[controller]")]
public class OrdersController(IOrderService service) : ControllerBase
{
    // Create an Order
    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        var createdOrder = await service.CreateOrder(createOrderDto);
        return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
    }

    // Get All Orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
    {
        var orders = await service.GetOrders();
        return Ok(orders);
    }

    // Get orders via Id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
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
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByCustomerId(int customerId)
    {
        var customer = await service.GetOrdersByCustomerId(customerId);
        return Ok(customer);
    }
    
    // Update Order Info
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOrder(int id, [FromBody] UpdateOrderDto updateOrderDto)
    {
        if (id != updateOrderDto.Id)
        {
            return BadRequest();
        }

        try
        {
            await service.UpdateOrder(updateOrderDto);
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

    [HttpPost("CreateWithEntries")]
    public async Task<ActionResult<OrderDto>> CreateOrderWithEntries( [FromBody] CreateOrderWithEntriesDto createOrderWithEntriesDto )
    {
        var createdOrder = await service.CreateOrderWithEntries(createOrderWithEntriesDto);
        return CreatedAtAction(nameof(GetOrder), new { id = createdOrder.Id }, createdOrder);
    }
    
}