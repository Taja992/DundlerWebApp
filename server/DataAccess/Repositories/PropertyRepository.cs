using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class PropertyRepository(DunderMifflinContext context) : IPropertyRepository
{
    public async Task<Property> AddProperty(Property property)
    {
        context.Properties.Add(property);
        await context.SaveChangesAsync();
        return property;
    }

    public async Task<IEnumerable<Property>> GetAllProperties()
    {
        return await context.Properties.ToListAsync();
    }

    public async Task<Property?> GetPropertyById(int id)
    {
        return await context.Properties.FindAsync(id);
    }
    
    public async Task<IEnumerable<Property>> GetPropertiesByIds(IEnumerable<int> ids)
    {
        return await context.Properties.Where(p => ids.Contains(p.Id)).ToListAsync();
    }

    public async Task UpdateProperty(Property property)
    {
        context.Entry(property).State = EntityState.Modified;
        await context.SaveChangesAsync();
    }

    public async Task DeleteProperty(int id)
    {
        var property = await context.Properties.FindAsync(id);
        if (property != null)
        {
            context.Properties.Remove(property);
            await context.SaveChangesAsync();
        }
    }

    public async Task<bool> PropertyExists(int id)
    {
        return await context.Properties.AnyAsync(e => e.Id == id);
    }
}