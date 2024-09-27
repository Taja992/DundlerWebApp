using DataAccess;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Service;
using System.Threading.Tasks;
using Xunit;

namespace DundlerMifflinWebApp.Tests;

public class CustomerServiceTests
{
    private readonly Mock<DunderMifflinContext> _mockContext;
    private readonly Mock<ILogger<CustomerService>> _mockLogger;
    private readonly CustomerService _customerService;

    public CustomerServiceTests()
    {
        _mockContext = new Mock<DunderMifflinContext>();
        _mockLogger = new Mock<ILogger<CustomerService>>();
        _customerService = new CustomerService(_mockContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task AddCustomer_ShouldAddCustomer()
    {
        // Arrange
        var customer = new Customer { Id = 1, Name = "Some Guy" };
        var mockDbSet = new Mock<DbSet<Customer>>();
        _mockContext.Setup(m => m.Customers).Returns(mockDbSet.Object);

        // Act
        var result = await _customerService.AddCustomer(customer);

        // Assert
        mockDbSet.Verify(m => m.Add(It.IsAny<Customer>()), Times.Once());
        _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once());
        Assert.Equal(customer, result);
    }
}