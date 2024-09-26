using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service;
using Service.Models;

namespace API.Controllers;


[ApiController]
[Route("[controller]")]
public class PaperController(DunderMifflinContext context) : ControllerBase
{
    // Add Paper
    [HttpPost]
    public async Task<ActionResult<Paper>> AddPaper([FromBody] Paper paper)
    {
        context.Papers.Add(paper);
        await context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPaperById), new { id = paper.Id }, paper);
    }

    // Get all Paper
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Paper>>> GetAllPaper()
    {
        return await context.Papers
            .Include(p => p.OrderEntries)
            .Include(p => p.Properties)
            .ToListAsync();
    }
    
    // Get Paper via Id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Paper>> GetPaperById(int id)
    {
        var paper = await context.Papers
            .Include(p => p.OrderEntries)
            .Include(p => p.Properties)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (paper == null)
        {
            return NotFound();
        }

        return Ok(paper);
    }
    
    // Get Paper Via Properties
    [HttpGet("property/{propertyId}")]
    public async Task<ActionResult<IEnumerable<Paper>>> GetPaperByProperty(int propertyId)
    {
        var papers = await context.Papers
            .Where(p => p.Properties.Any(prop => prop.Id == propertyId))
            .ToListAsync();
        return Ok(papers);
    }
    
    // Update Paper Info
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePaper(int id, [FromBody] Paper paper)
    {
        if (id != paper.Id)
        {
            return BadRequest();
        }

        context.Entry(paper).State = EntityState.Modified;

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PaperExists(id))
            {
                return NotFound();
            }

            {
                throw;
            }
        }

        return NoContent();
    }
    
    private bool PaperExists(int id)
    {
        return context.Papers.Any(e => e.Id == id);
    }
    
    //Delete Paper
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePaper(int id)
    {
        var paper = await context.Papers.FindAsync(id);
        if (paper == null)
        {
            return NotFound();
        }

        context.Papers.Remove(paper);
        await context.SaveChangesAsync();

        return NoContent();
    }
    
}