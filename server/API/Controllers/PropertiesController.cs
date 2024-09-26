using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;
using Service.Models;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class PropertiesController(DunderMifflinContext context) : ControllerBase
{
    //Create
    [HttpPost]
    public async Task<ActionResult<Property>> CreateProperties([FromBody] Property property)
    {
        context.Properties.Add(property);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
    }
    
    //Read
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
    {
        var properties = await context.Properties.ToListAsync();
        return Ok(properties);
    }

    // Get a single property by ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Property>> GetProperty(int id)
    {
        var property = await context.Properties.FindAsync(id);
        if (property == null)
        {
            return NotFound();
        }

        return Ok(property);
    }
    
    // Update Property
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProperties(int id, [FromBody] Property property)
    {
        if (id != property.Id)
        {
            return BadRequest();
        }

        context.Entry(property).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PropertyExists(id))
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
    private bool PropertyExists(int id)
    {
        return context.Properties.Any(e => e.Id == id);
    }
    
    //Delete
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProperties(int id)
    {
        var property = await context.Properties.FindAsync(id);
        if (property == null)
        {
            return NotFound();
        }

        context.Properties.Remove(property);
        await context.SaveChangesAsync();

        return NoContent();
    }
}