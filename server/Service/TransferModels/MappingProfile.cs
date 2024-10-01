using AutoMapper;
using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.TransferModels;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Customer, CustomerDto>()
            .ForMember(dest => dest.Orders, opt => opt.Ignore()); // Prevent circular reference

        CreateMap<Order, OrderDto>()
            .ForMember(dest => dest.Customer, opt => opt.Ignore()); // Prevent circular reference

        CreateMap<OrderEntry, OrderEntryDto>();
        CreateMap<Paper, PaperDto>();
        CreateMap<Property, PropertyDto>();
    }
}