using DataAccess;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Mappers;


namespace Service;



public interface IPropertyService
{
    Task<IEnumerable<PropertyDto>> GetAllProperties();
    Task<PropertyDto?> GetPropertyById(int id);
    Task<PropertyDto> AddProperty(Property property);
    Task UpdateProperty(Property property);
    Task DeleteProperty(int id);
}

public class PropertyService(DunderMifflinContext context, ILogger<CustomerService> logger) : IPropertyService
{
    // As a business admin I want to be able to create custom properties for paper products (water-resistant, study, etc).
    // This involves creating and managing custom properties for products.
    
    
    
    public async Task<PropertyDto> AddProperty(Property property)
    {
        context.Properties.Add(property);
        await context.SaveChangesAsync();
        return property.ToDto();
    }

    public async Task<IEnumerable<PropertyDto>> GetAllProperties()
    {
        var properties = await context.Properties.ToListAsync();
        return properties.Select(p => p.ToDto());
    }

    public async Task<PropertyDto?> GetPropertyById(int id)
    {
        var property = await context.Properties.FindAsync(id);
        return property?.ToDto();
    }
    

    public async Task UpdateProperty(Property property)
    {
        context.Entry(property).State = EntityState.Modified;
        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (PropertyExists(property.Id))
            {
                logger.LogError("Concurrency error in UpdateProperty for property ID {PropertyId}", property.Id);
                throw;

            }
            var message = $"property with ID {property.Id} not found.";
            logger.LogError("Error in UpdateProperty: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    
        
    private bool PropertyExists(int id)
    {
        return context.Properties.Any(e => e.Id == id);
    }

    public async Task DeleteProperty(int id)
    {
        var property = await context.Properties.FindAsync(id);
        if (property == null)
        {
            var message = $"Property with ID {id} not found.";
            logger.LogError("Error in DeleteProperty: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        context.Properties.Remove(property);
        await context.SaveChangesAsync();
    }
}