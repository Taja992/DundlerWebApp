using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.TransferModels.Mappers;

public static class PropertyMapper
{
    public static PropertyDto ToDto(this Property property)
    {
        return new PropertyDto
        {
            Id = property.Id,
            PropertyName = property.PropertyName
        };
    }

    public static Property ToEntity(this PropertyDto propertyDto)
    {
        return new Property
        {
            Id = propertyDto.Id,
            PropertyName = propertyDto.PropertyName
        };
    }
}