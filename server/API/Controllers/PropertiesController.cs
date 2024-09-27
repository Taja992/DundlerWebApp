using Microsoft.AspNetCore.Mvc;
using DataAccess.Models;
using Service;
using Service.TransferModels.DTOs;


namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class PropertiesController(IPropertyService service) : ControllerBase
{
    //Create
    [HttpPost]
    public async Task<ActionResult<PropertyDto>> CreateProperties([FromBody] Property property)
    {
        var newProperty = await service.AddProperty(property);
        return CreatedAtAction(nameof(GetProperty), new { id = newProperty.Id }, newProperty);
    }
    
    //Read
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties()
    {
        var properties = await service.GetAllProperties();
        return Ok(properties);
    }

    // Get a single property by ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PropertyDto>> GetProperty(int id)
    {
        var property = await service.GetPropertyById(id);
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
        
        try
        {
            await service.UpdateProperty(property);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        return NoContent();
    }
    // Used above in Update to check if the order still exists to stop concurrency issues

    
    //Delete
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProperties(int id)
    {
        try
        {
            await service.DeleteProperty(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

    }
}