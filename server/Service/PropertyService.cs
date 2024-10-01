using AutoMapper;
using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;


namespace Service;



public interface IPropertyService
{
    Task<IEnumerable<PropertyDto>> GetAllProperties();
    Task<PropertyDto?> GetPropertyById(int id);
    Task<PropertyDto> AddProperty(CreatePropertyDto createPropertyDto);
    Task UpdateProperty(UpdatePropertyDto updatePropertyDto);
    Task DeleteProperty(int id);
}

public class PropertyService(ILogger<CustomerService> logger, IPropertyRepository propertyRepository, IMapper mapper) : IPropertyService
{
    // As a business admin I want to be able to create custom properties for paper products (water-resistant, study, etc).
    // This involves creating and managing custom properties for products.
    
    public async Task<PropertyDto> AddProperty(CreatePropertyDto createPropertyDto)
    {
        var property = createPropertyDto.ToProperty();
        Property newProperty = await propertyRepository.AddProperty(property);
        return new PropertyDto().FromEntity(newProperty, mapper);
    }

    public async Task<IEnumerable<PropertyDto>> GetAllProperties()
    {
        var properties = await propertyRepository.GetAllProperties();
        return properties.Select(c => new PropertyDto().FromEntity(c, mapper));
    }

    public async Task<PropertyDto?> GetPropertyById(int id)
    {
        var property = await propertyRepository.GetPropertyById(id);
        if (property != null)
        {
            return new PropertyDto().FromEntity(property, mapper);
        }

        {
            var message = $"Property with ID:{id} Not Found";
            logger.LogError("Error in GetPropertyById: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    

    public async Task UpdateProperty(UpdatePropertyDto updatePropertyDto)
    {
        var property = updatePropertyDto.ToProperty();
        try
        {
            await propertyRepository.UpdateProperty(property);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (await propertyRepository.PropertyExists(property.Id))
            {
                logger.LogError("Concurrency error in UpdateProperty for property ID {PropertyId}", property.Id);
                throw;
            }
            var message = $"Property with ID {property.Id} not found.";
            logger.LogError("Error in UpdateProperty: {Message}", message);
            throw new KeyNotFoundException(message);
        }
        
    }
    

    public async Task DeleteProperty(int id)
    {
        var property = await propertyRepository.GetPropertyById(id);
        if (property == null)
        {
            var message = $"Property with ID {id} not found.";
            logger.LogError("Error in DeleteProperty: {Message}", message);
            throw new KeyNotFoundException(message);
        }
        await propertyRepository.DeleteProperty(id);
    }
}