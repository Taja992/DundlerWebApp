using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Service;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using System.Linq;

namespace DundlerMifflinWebApp.Tests;

public class CustomWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
{
    public Mock<ICustomerService> MockCustomerService { get; } = new();
    public Mock<IOrderService> MockOrderService { get; } = new();
    public Mock<IPaperService> MockPaperService { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var customerServiceDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(ICustomerService));
            if (customerServiceDescriptor != null)
            {
                services.Remove(customerServiceDescriptor);
            }

            var orderServiceDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IOrderService));
            if (orderServiceDescriptor != null)
            {
                services.Remove(orderServiceDescriptor);
            }

            var paperServiceDescriptor = services.SingleOrDefault(d => d.ServiceType == typeof(IPaperService));
            if (paperServiceDescriptor != null)
            {
                services.Remove(paperServiceDescriptor);
            }

            // Add the mock service
            services.AddSingleton(MockCustomerService.Object);
            services.AddSingleton(MockOrderService.Object);
            services.AddSingleton(MockPaperService.Object);
        });
    }
}