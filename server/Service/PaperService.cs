using DataAccess;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Mappers;


namespace Service;


public interface IPaperService
{
    Task<IEnumerable<PaperDto>> GetAllPaper();
    Task<PaperDto?> GetPaperById(int id);
    Task<PaperDto> AddPaper(Paper paper);
    Task UpdatePaper(Paper paper);
    Task DeletePaper(int id);
    Task<IEnumerable<PaperDto>> GetPaperByProperty(int propertyId);
}


public class PaperService(DunderMifflinContext context, ILogger<CustomerService> logger) : IPaperService
{
    // As a customer I want to have a product overview with filtering, ordering and full-text search preferences.
    // This involves retrieving a list of products with various filtering, ordering, and search options.
    //
    // As a business admin I want to create new products, discontinue products and restock products.
    // This involves creating, updating, and managing the stock status of products.
    public async Task<PaperDto> AddPaper(Paper paper)
    {
        context.Papers.Add(paper);
        await context.SaveChangesAsync();
        return paper.ToDto();
    }
    
    public async Task<IEnumerable<PaperDto>> GetAllPaper()
    {
        var papers = await context.Papers
            .Include(p => p.OrderEntries)
            .Include(p => p.Properties)
            .ToListAsync();
        return papers.Select(p => p.ToDto());
    }

    public async Task<PaperDto?> GetPaperById(int id)
    {
        var paper =  await context.Papers
            .Include(p => p.OrderEntries)
            .Include(p => p.Properties)
            .SingleOrDefaultAsync(p => p.Id == id);
        return paper?.ToDto();
    }
    
    public async Task<IEnumerable<PaperDto>> GetPaperByProperty(int propertyId)
    {
        var paper = await context.Papers
            .Where(p => p.Properties.Any(prop => prop.Id == propertyId))
            .ToListAsync();
        return paper.Select(p => p.ToDto());
    }
    

    public async Task UpdatePaper(Paper paper)
    {
        context.Entry(paper).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (PaperExists(paper.Id))
            {
                logger.LogError("Concurrency error in UpdatePaper for paper ID {PaperId}", paper.Id);
                throw;
            }
            var message = $"Paper with ID {paper.Id} not found.";
            logger.LogError("Error in UpdatePaper: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    
    private bool PaperExists(int id)
    {
        return context.Papers.Any(e => e.Id == id);
    }

    public async Task DeletePaper(int id)
    {
        var paper = await context.Papers.FindAsync(id);
        if (paper == null)
        {
            var message = $"Paper with ID {id} not found.";
            logger.LogError("Error in DeletePaper: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        context.Papers.Remove(paper);
        await context.SaveChangesAsync();
    }
    
}