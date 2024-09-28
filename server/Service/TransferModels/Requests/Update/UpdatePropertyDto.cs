using DataAccess.Models;

namespace Service.TransferModels.Requests.Update;

    public class UpdatePropertyDto
    {
        public int Id { get; set; }
        public string PropertyName { get; set; } = null!;

        public Property ToProperty()
        {
            return new Property
            {
                Id = Id,
                PropertyName = PropertyName
            };
        }
    }
