using Microsoft.AspNetCore.Mvc;
using DataAccess.Models;
using Service;


namespace API.Controllers;


[ApiController]
[Route("[controller]")]
public class PaperController(IPaperService service) : ControllerBase
{
    // Add Paper
    [HttpPost]
    public async Task<ActionResult<Paper>> AddPaper([FromBody] Paper paper)
    {
        var addedPaper = await service.AddPaper(paper);
        
        return CreatedAtAction(nameof(GetPaperById), new { id = addedPaper.Id }, addedPaper);
    }

    // Get all Paper
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Paper>>> GetAllPaper()
    {
        var papers = await service.GetAllPaper();
        return Ok(papers);
    }
    
    // Get Paper via Id
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Paper>> GetPaperById(int id)
    {
        var paper = await service.GetPaperById(id);

        if (paper == null)
        {
            return NotFound();
        }

        return Ok(paper);
    }
    
// Get Paper Via Properties
    [HttpGet("property/{propertyId:int}")]
    public async Task<ActionResult<IEnumerable<Paper>>> GetPaperByProperty(int propertyId)
    {
        var papers = await service.GetPaperByProperty(propertyId);
        return Ok(papers);
    }
    
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdatePaper(int id, [FromBody] Paper paper)
    {
        if (id != paper.Id)
        {
            return BadRequest();
        }

        try
        {
            await service.UpdatePaper(paper);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        return NoContent();
    }
    
    
// Delete Paper
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeletePaper(int id)
    {
        try
        {
            await service.DeletePaper(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
    
}