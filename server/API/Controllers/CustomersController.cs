using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;
using Service.Models;

namespace API.Controllers;


[ApiController]
[Route("[controller]")]
public class CustomersController(DunderMifflinContext context) : ControllerBase
{
    
    //Create
    [HttpPost]
    public async Task<ActionResult<Customer>> CreateCustomers([FromBody] Customer customer)
    {
        context.Customers.Add(customer);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id}, customer);
    }
    
    // // Add Order to Customer
    // [HttpPost("{customerId:int}/orders")]
    // public async Task<IActionResult> AddOrderToCustomer(int customerId, [FromBody] Order order)
    // {
    //     var customer = await context.Customers.FindAsync(customerId);
    //     if (customer == null)
    //     {
    //         return NotFound();
    //     }
    //     
    //     customer.Orders.Add(order);
    //     await context.SaveChangesAsync();
    //
    //     return Ok(order);
    // }
    
    // Get all Customers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        var customer = await context.Customers.ToListAsync();
        return Ok(customer);
    }
    
    // Get Single Customer with id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Customer>> GetCustomer(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        return Ok(customer);
    }
    
    //Get customers including orders
    [HttpGet("customer-orders")]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomersWithOrders()
    {
        var customers = await context.Customers.Include(c => c.Orders).ToListAsync();
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

        context.Entry(customer).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CustomerExists(id))
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
    private bool CustomerExists(int id)
    {
        return context.Customers.Any(e => e.Id == id);
    }
    
    //Delete
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCustomer(int id)
    {
        var customer = await context.Customers.FindAsync(id);
        if (customer == null)
        {
            return NotFound();
        }

        context.Customers.Remove(customer);
        await context.SaveChangesAsync();
        
        return NoContent();
    }
    
}