using DataAccess.Models;


namespace Service.TransferModels.DTOs;

    public class PaperDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool Discontinued { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }
        public List<OrderEntryDto> OrderEntries { get; set; } = new();
        public List<PropertyDto> Properties { get; set; } = new();

        public PaperDto FromEntity(Paper paper)
        {
            return new PaperDto
            {
                Id = paper.Id,
                Name = paper.Name,
                Discontinued = paper.Discontinued,
                Stock = paper.Stock,
                Price = paper.Price,
                OrderEntries = paper.OrderEntries.Select(oe => new OrderEntryDto().FromEntity(oe)).ToList(),
                Properties = paper.Properties.Select(p => new PropertyDto().FromEntity(p)).ToList()
            };
        }
    }
