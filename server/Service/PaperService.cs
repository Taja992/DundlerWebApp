using AutoMapper;
using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;


namespace Service;


public interface IPaperService
{
    Task<IEnumerable<PaperDto>> GetAllPaper();
    Task<PaperDto?> GetPaperById(int id);
    Task<PaperDto> AddPaper(CreatePaperDto createPaperDto);
    Task UpdatePaper(UpdatePaperDto updatePaperDto);
    Task DeletePaper(int id);
    Task<IEnumerable<PaperDto>> GetPaperByProperty(int propertyId);
}


public class PaperService(ILogger<CustomerService> logger, 
    IPaperRepository paperRepository, 
    IMapper mapper, IValidator<CreatePaperDto> createValidator,
    IValidator<UpdatePaperDto> updateValidator) : IPaperService
{
    // As a customer I want to have a product overview with filtering, ordering and full-text search preferences.
    // This involves retrieving a list of products with various filtering, ordering, and search options.
    //
    // As a business admin I want to create new products, discontinue products and restock products.
    // This involves creating, updating, and managing the stock status of products.
    public async Task<PaperDto> AddPaper(CreatePaperDto createPaperDto)
    {
        await createValidator.ValidateAndThrowAsync(createPaperDto);
        var paper = createPaperDto.ToPaper();
        Paper newPaper = await paperRepository.AddPaper(paper);
        return new PaperDto().FromEntity(newPaper, mapper);
    }
    
    public async Task<IEnumerable<PaperDto>> GetAllPaper()
    {
        var paper = await paperRepository.GetAllPaper();
        return paper.Select(p => new PaperDto().FromEntity(p, mapper));
    }

    public async Task<PaperDto?> GetPaperById(int id)
    {
        var paper = await paperRepository.GetPaperById(id);
        if (paper != null)
        {
            return new PaperDto().FromEntity(paper, mapper);
        }
        {
            var message = $"Paper with ID:{id} Not Found";
            logger.LogError("Error in GetPaperById: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    
    public async Task<IEnumerable<PaperDto>> GetPaperByProperty(int propertyId)
    {
        var paper = await paperRepository.GetPaperByProperty(propertyId);
        return paper.Select(p => new PaperDto().FromEntity(p, mapper));

    }
    

    public async Task UpdatePaper(UpdatePaperDto updatePaperDto)
    {
        await updateValidator.ValidateAndThrowAsync(updatePaperDto);
        var paper = updatePaperDto.ToPaper();
        try
        {
            await paperRepository.UpdatePaper(paper);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (await paperRepository.PaperExists(paper.Id))
            {
                logger.LogError("Concurrency error in UpdatePaper for paper ID {PaperId}", paper.Id);
                throw;
            }
            var message = $"Paper with ID {paper.Id} not found.";
            logger.LogError("Error in UpdatePaper: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    

    public async Task DeletePaper(int id)
    {
        var paper = await paperRepository.GetPaperById(id);
        if (paper == null)
        {
            var message = $"Paper with ID {id} not found.";
            logger.LogError("Error in DeletePaper: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        await paperRepository.DeletePaper(id);
    }
    
}