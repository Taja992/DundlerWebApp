using DataAccess.Models;
using System;
using System.Collections.Generic;

namespace Service.TransferModels.Requests.Create;

    public class CreateOrderWithEntriesDto
    {
        public DateTime OrderDate { get; set; }
        public DateOnly? DeliveryDate { get; set; }
        public string Status { get; set; } = null!;
        public double TotalAmount { get; set; }
        public int? CustomerId { get; set; }
        public List<CreateOrderEntryDto> OrderEntries { get; set; } = new();
    }
