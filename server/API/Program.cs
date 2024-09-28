using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Models;
using DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using Service;

namespace API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();

        // Check if running in test mode
        var isTest = builder.Environment.IsEnvironment("Test");

        // if (isTest)
        // {
        //     builder.Services.AddDbContext<DunderMifflinContext>(options =>
        //         options.UseInMemoryDatabase("InMemoryDbForTesting"));
        // }
        // else
        // {
            builder.Services.AddDbContext<DunderMifflinContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("DunderMifflinDatabase")));
        //}

        // Register the repositories
        builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
        builder.Services.AddScoped<IOrderRepository, OrderRepository>();
        builder.Services.AddScoped<IPaperRepository, PaperRepository>();
        builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();

        // Register Services
        builder.Services.AddScoped<ICustomerService, CustomerService>();
        builder.Services.AddScoped<IOrderService, OrderService>();
        builder.Services.AddScoped<IPaperService, PaperService>();
        builder.Services.AddScoped<IPropertyService, PropertyService>();

        // Configure CORS
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(b =>
            {
                b.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        // Add services to the container.
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Dunder Mifflin API V1");
                c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
            });
        }

        app.UseHttpsRedirection();

        // Enable CORS
        app.UseCors();
        app.UseAuthorization();
        app.MapControllers();

        app.Run();
    }
}