using AutoMapper;
using DataAccess.Models;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

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
        
        CreateMap<Paper, PaperDto>()
            .ForMember(dest => dest.PropertyNames, opt => opt.MapFrom(src => src.Properties.Select(p => p.PropertyName).ToList()));
        CreateMap<Property, PropertyDto>();
        
        CreateMap<Property, PropertyDto>();

        CreateMap<CreateOrderWithEntriesDto, Order>()
            .ForMember(dest => dest.OrderEntries, opt => opt.MapFrom(src => src.OrderEntries));
        
        CreateMap<CreateOrderEntryDto, OrderEntry>();
    }
}