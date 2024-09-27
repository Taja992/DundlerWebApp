using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataAccess.Models;
using Service;
using Service.TransferModels.DTOs;


namespace API.Controllers;


[ApiController]
[Route("[controller]")]
public class CustomersController(ICustomerService service) : ControllerBase
{
    
    //Create
    [HttpPost]
    public async Task<ActionResult<CustomerDto>> CreateCustomers([FromBody] Customer customer)
    {
        var createdCustomer = await service.AddCustomer(customer);
        return CreatedAtAction(nameof(GetCustomer), new { id = createdCustomer.Id }, createdCustomer);
    }
    
    // Add Order to Customer
    [HttpPost("{customerId:int}/orders")]
    public async Task<IActionResult> AddOrderToCustomer(int customerId, [FromBody] Order order)
    {
        try
        {
            await service.AddOrderToCustomer(customerId, order);
            return Ok(order);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
    
    // Get all Customers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
    {
        var customer = await service.GetCustomers();
        return Ok(customer);
    }
    
    // Get Single Customer with id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CustomerDto>> GetCustomer(int id)
    {
        var customer = await service.GetCustomerById(id);
        if (customer == null)
        {
            return NotFound();
        }
        
        return Ok(customer);
    }
    
    //Get customers including orders
    [HttpGet("customer-orders")]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomersWithOrders()
    {
        var customers = await service.GetCustomersWithOrders();
        return Ok(customers);
    }
    
    //Update
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
    {
        if (id != customer.Id)
        {
            return BadRequest();
        }

        try
        {
            await service.UpdateCustomer(customer);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict();
        }

        return NoContent();
    }
    
    //Delete
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        try
        {
            await service.DeleteCustomer(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

}