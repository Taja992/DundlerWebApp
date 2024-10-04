using System.Text.Json.Serialization;
using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Service;
using Service.TransferModels;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;

namespace API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });

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
        
        // Register FluentValidation validators
        builder.Services.AddValidatorsFromAssemblyContaining<CreateCustomerDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdateCustomerDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdateOrderDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreatePaperDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdatePaperDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreatePropertyDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<UpdatePropertyDto>();
        builder.Services.AddValidatorsFromAssemblyContaining<CreateOrderEntryDto>();

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
        
        // Add AutoMapper
        builder.Services.AddAutoMapper(typeof(MappingProfile));

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
                c.RoutePrefix = string.Empty;
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