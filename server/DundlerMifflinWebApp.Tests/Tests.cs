using System.Net.Http.Json;
using API;
using DataAccess.Models;
using Moq;
using Xunit;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

namespace DundlerMifflinWebApp.Tests;

    public class Tests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly CustomWebApplicationFactory<Program> _factory;

        public Tests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task TryToAddCustomer()
        {
            // Arrange
            var client = _factory.CreateClient();
            var createCustomerDto = new CreateCustomerDto()
            {
                Name = "Lets Test",
                Address = "123 Test St",
                Phone = "+1234567890",
                Email = "test@letstest.com"
            };

            var customerDto = new CustomerDto()
            {
                Id = 1,
                Name = "Lets Test",
                Address = "123 Test St",
                Phone = "+1234567890",
                Email = "test@example.com"
            };

            _factory.MockCustomerService.Setup(service => service.AddCustomer(It.IsAny<CreateCustomerDto>()))
                .ReturnsAsync(customerDto);

            // Act
            var response = await client.PostAsJsonAsync("/Customers", createCustomerDto);

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);

            var createdCustomer = await response.Content.ReadFromJsonAsync<CustomerDto>();
            Assert.NotNull(createdCustomer);
            Assert.Equal("Lets Test", createdCustomer.Name);
            Assert.Equal("test@example.com", createdCustomer.Email);
            Assert.Equal("123 Test St", createdCustomer.Address);
            Assert.Equal("+1234567890", createdCustomer.Phone);
        }
        
        [Fact]
        public async Task TryToAddOrderWithOrderEntry()
        {
            
            // Arrange
            var client = _factory.CreateClient();
            var createOrderWithEntriesDto = new CreateOrderWithEntriesDto
            {
                OrderDate = new DateTime(2023, 10, 1, 12, 0, 0),
                DeliveryDate = new DateOnly(2023, 10, 5),
                Status = "Pending",
                TotalAmount = 100.0,
                CustomerId = 1,
                OrderEntries = new List<CreateOrderEntryDto>
                {
                    new CreateOrderEntryDto() { Quantity = 5, ProductId = 5},
                    new CreateOrderEntryDto() { Quantity = 9, ProductId = 24}
                }
            };

            var orderDto = new OrderDto
            {
                Id = 1,
                OrderDate = DateTime.Parse("2023-10-01T12:00:00Z"),
                DeliveryDate = DateOnly.FromDateTime(DateTime.Parse("2023-10-05")),
                Status = "Pending",
                TotalAmount = 100.0,
                CustomerId = 1,
                OrderEntries = new List<OrderEntryDto>
                {
                    new OrderEntryDto { Quantity = 5, ProductId = 5 },
                    new OrderEntryDto { Quantity = 9, ProductId = 24 }
                }
            };
            
            _factory.MockOrderService.Setup(service => service.CreateOrderWithEntries(It.IsAny<CreateOrderWithEntriesDto>()))
                .ReturnsAsync(orderDto);
            
            // Act
            var response = await client.PostAsJsonAsync("Orders/CreateWithEntries", createOrderWithEntriesDto);
            
            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);

            var createdOrder = await response.Content.ReadFromJsonAsync<OrderDto>();
            Assert.NotNull(createdOrder);
            Assert.Equal("Pending", createdOrder.Status);
            Assert.Equal(100.0, createdOrder.TotalAmount);
            Assert.Equal(1, createdOrder.CustomerId);
            // Make sure 2 order entries have been put in
            Assert.Equal(2, createdOrder.OrderEntries.Count);

        }


        [Fact]
        public async Task TryToCreateNewPaper()
        {
            
            // Arrange
            var client = _factory.CreateClient();
            var createPaperDto = new CreatePaperDto
            {
                Name = "IAmAPaper",
                Discontinued = false,
                Stock = 53,
                Price = 52
            };

            var paperDto = new PaperDto()
            {
                Id = 1,
                Name = "IAmAPaper",
                Discontinued = false,
                Stock = 53,
                Price = 52
            };

            _factory.MockPaperService.Setup(service => service.AddPaper(It.IsAny<CreatePaperDto>()))
                .ReturnsAsync(paperDto);
            
            // Act

            var response = await client.PostAsJsonAsync("/Paper", createPaperDto);
            
            // Assert

            response.EnsureSuccessStatusCode();
            Assert.Equal(System.Net.HttpStatusCode.Created, response.StatusCode);

            var createdPaper = await response.Content.ReadFromJsonAsync<PaperDto>();
            Assert.NotNull(createdPaper);
            Assert.Equal("IAmAPaper", createdPaper.Name);
            Assert.False(createdPaper.Discontinued);
            Assert.Equal(53, createdPaper.Stock);
            Assert.Equal(52, createdPaper.Price);

        }
        
        
    }
