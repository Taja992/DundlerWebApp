using DataAccess.Models;

namespace DataAccess.Interfaces;

public interface IPaperRepository
{
    Task<Paper> AddPaper(Paper paper);
    Task<IEnumerable<Paper>> GetAllPaper();
    Task<Paper?> GetPaperById(int id);
    Task<IEnumerable<Paper>> GetPaperByProperty(int propertyId);
    Task UpdatePaper(Paper paper);
    Task DeletePaper(int id);
    Task<bool> PaperExists(int id);
}