using DataAccess.Models;

namespace Service.TransferModels.Requests.Create;

    public class CreatePaperDto
    {
        public string Name { get; set; } = null!;
        public bool Discontinued { get; set; }
        public int Stock { get; set; }
        public double Price { get; set; }

        public Paper ToPaper()
        {
            return new Paper
            {
                Name = Name,
                Discontinued = Discontinued,
                Stock = Stock,
                Price = Price
            };
        }
    }
