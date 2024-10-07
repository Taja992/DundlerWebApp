using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;

namespace DataAccess.Repositories;

public class PaperRepository(DunderMifflinContext context) : IPaperRepository
{
    public async Task<Paper> AddPaper(Paper paper)
    {
        context.Papers.Add(paper);
        await context.SaveChangesAsync();
        return paper;
    }

    public async Task<IEnumerable<Paper>> GetAllPaper()
    {
        return await context.Papers
            .Include(p => p.OrderEntries)
            .Include(p => p.Properties)
            .ToListAsync();
    }

    public async Task<Paper?> GetPaperById(int id)
    {
        return await context.Papers
            .Include(p => p.OrderEntries)
            .Include(p => p.Properties)
            .SingleOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Paper>> GetPaperByProperty(int propertyId)
    {
        return await context.Papers
            .Where(p => p.Properties.Any(prop => prop.Id == propertyId))
            .ToListAsync();
    }

    public async Task UpdatePaper(Paper paper, List<int> propertyIds)
    {
        // Update the paper
        context.Entry(paper).State = EntityState.Modified;

        // Clear existing properties in a different method and await till its been done to
        // ensure its been cleared
        await ClearPaperProperties(paper.Id);

        // Add new properties
        if (propertyIds.Count > 0)
        {
            var newProperties = await context.Properties
                .Where(p => propertyIds.Contains(p.Id))
                .ToListAsync();

            var existingPaper = await context.Papers
                .Include(p => p.Properties)
                .SingleOrDefaultAsync(p => p.Id == paper.Id);

            if (existingPaper != null)
            {
                foreach (var property in newProperties)
                {
                    existingPaper.Properties.Add(property);
                }
            }
        }

        await context.SaveChangesAsync();
    }

    private async Task ClearPaperProperties(int paperId)
    {
        var existingPaper = await context.Papers
            .Include(p => p.Properties)
            .SingleOrDefaultAsync(p => p.Id == paperId);

        if (existingPaper == null)
        {
            throw new KeyNotFoundException($"Paper with ID {paperId} not found.");
        }

        existingPaper.Properties.Clear();
        await context.SaveChangesAsync();
    }

    public async Task DeletePaper(int id)
    {
        var paper = await context.Papers.FindAsync(id);
        if (paper != null)
        {
            context.Papers.Remove(paper);
            await context.SaveChangesAsync();
        }
    }

    public async Task<bool> PaperExists(int id)
    {
        return await context.Papers.AnyAsync(e => e.Id == id);
    }
}