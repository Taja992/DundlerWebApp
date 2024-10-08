﻿using AutoMapper;
using DataAccess.Models;


namespace Service.TransferModels.DTOs;

    public class PropertyDto
    {
        public int Id { get; set; }
        public string PropertyName { get; set; } = null!;
        public List<PaperDto> Papers { get; set; } = new();
        
        public PropertyDto FromEntity(Property property, IMapper mapper)
        {
            return mapper.Map<PropertyDto>(property);
        }

        // public PropertyDto FromEntity(Property property, IMapper mapper)
        // {
        //     return new PropertyDto
        //     {
        //         Id = property.Id,
        //         PropertyName = property.PropertyName,
        //         Papers = property.Papers.Select(p => new PaperDto().FromEntity(p, mapper)).ToList()
        //     };
        // }
    }
