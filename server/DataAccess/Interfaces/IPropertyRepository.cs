using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IPropertyRepository
{
    Task<Property> AddProperty(Property property);
    Task<IEnumerable<Property>> GetAllProperties();
    Task<Property?> GetPropertyById(int id);
    Task UpdateProperty(Property property);
    Task DeleteProperty(int id);
    Task<bool> PropertyExists(int id);
}