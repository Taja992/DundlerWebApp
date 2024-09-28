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

    public async Task UpdatePaper(Paper paper)
    {
        context.Entry(paper).State = EntityState.Modified;
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