using DataAccess.Models;
using Service.TransferModels.DTOs;

namespace Service.TransferModels.Mappers;


public static class PaperMapper
{
    public static PaperDto ToDto(this Paper paper)
    {
        return new PaperDto
        {
            Id = paper.Id,
            Name = paper.Name,
            Discontinued = paper.Discontinued,
            Stock = paper.Stock,
            Price = paper.Price
        };
    }

    public static Paper ToEntity(this PaperDto paperDto)
    {
        return new Paper
        {
            Id = paperDto.Id,
            Name = paperDto.Name,
            Discontinued = paperDto.Discontinued,
            Stock = paperDto.Stock,
            Price = paperDto.Price
        };
    }
}