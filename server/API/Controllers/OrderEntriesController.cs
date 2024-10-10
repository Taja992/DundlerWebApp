using DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DataAccess.Models;


namespace API.Controllers;


// My OrderEntries are my only controller that I ended up not making a repository and service for, for no good reason
// Everything else uses the proper design pattern, the only one getting used is createOrderEntry
[ApiController]
[Route("[controller]")]
public class OrderEntriesController(DunderMifflinContext context) : ControllerBase
{
    //Create new Order Entry
    [HttpPost]
    public async Task<ActionResult<OrderEntry>> CreateOrderEntry([FromBody] OrderEntry orderEntry)
    {
        context.OrderEntries.Add(orderEntry);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOrderEntry), new { id = orderEntry.Id }, orderEntry);
    }

    // Retrieves a specific order entry by ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderEntry>> GetOrderEntry(int id)
    {
        var orderEntry = await context.OrderEntries
            .Include(oe => oe.Order)
            .Include(oe => oe.Product)
            .FirstOrDefaultAsync(oe => oe.Id == id);
        if (orderEntry == null)
        {
            return NotFound();
        }

        return orderEntry;
    }
    
    // Retrieves all order entries
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntries()
    {
        var orderEntries = await context.OrderEntries
            .Include(oe => oe.Order)
            .Include(oe => oe.Product)
            .ToListAsync();
        return Ok(orderEntries);
    }
    
    // Retrieves order entries by order ID
    [HttpGet("order/{orderId:int}")]
    public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntriesByOrderId(int orderId)
    {
        var orderEntries = await context.OrderEntries
            .Where(oe => oe.OrderId == orderId)
            .Include(oe => oe.Order)
            .Include(oe => oe.Product)
            .ToListAsync();
        return Ok(orderEntries);
    }
    
    // Retrieves order entries by product ID
    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntriesByProductId(int productId)
    {
        var orderEntries = await context.OrderEntries
            .Where(oe => oe.ProductId == productId)
            .Include(oe => oe.Order)
            .Include(oe => oe.Product)
            .ToListAsync();
        return Ok(orderEntries);
    }
    
    // Updates an existing order entry
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateOrderEntry(int id, [FromBody] OrderEntry orderEntry)
    {
        if (id != orderEntry.Id)
        {
            return BadRequest();
        }

        context.Entry(orderEntry).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OrderEntryExists(id))
            {
                return NotFound();
            }
            {
                throw;
            }
        }
        return NoContent();
    }

    private bool OrderEntryExists(int id)
    {
        return context.OrderEntries.Any(oe => oe.Id == id);
    }
    
    // Deletes an order entry by ID
    [HttpDelete("{id:int}")]

    public async Task<IActionResult> DeleteOrderEntry(int id)
    {
        var orderEntry = await context.OrderEntries.FindAsync(id);
        if (orderEntry == null)
        {
            return NotFound();
        }

        context.OrderEntries.Remove(orderEntry);
        await context.SaveChangesAsync();

        return NoContent();
    }
}