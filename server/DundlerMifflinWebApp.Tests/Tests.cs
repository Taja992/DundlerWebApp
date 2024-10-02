using System.Net.Http.Json;
using API;
using Moq;
using Xunit;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;

namespace DundlerMifflinWebApp.Tests
{
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
    }
}