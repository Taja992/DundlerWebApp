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

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing service registration
            var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(ICustomerService));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add the mock service
            services.AddSingleton(MockCustomerService.Object);
        });
    }
}