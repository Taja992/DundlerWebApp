using DataAccess.Models;

namespace Service.TransferModels.Requests.Update;

    public class UpdatePaperDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public bool Discontinued { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }
        public List<int> PropertyIds { get; set; } = new();

        public Paper ToPaper(IEnumerable<Property> properties)
        {
            return new Paper
            {
                Id = Id,
                Name = Name,
                Discontinued = Discontinued,
                Stock = Stock,
                Price = Price,
                Properties = properties.ToList()
            };
        }
    }
