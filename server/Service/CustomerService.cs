using AutoMapper;
using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;


namespace Service;


public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetCustomers();
    Task<CustomerDto?> GetCustomerById(int id);
    Task<CustomerDto> AddCustomer(CreateCustomerDto createCustomerDto);
    Task UpdateCustomer(UpdateCustomerDto updateCustomerDto);
    Task DeleteCustomer(int id);
    Task AddOrderToCustomer(int customerId, OrderDto orderDto);
    Task<IEnumerable<CustomerDto>> GetCustomersWithOrders();
}

// As a customer I want to be able to see my own order history.
// This involves retrieving the order history for a specific customer.

public class CustomerService(DunderMifflinContext context, ILogger<CustomerService> logger, ICustomerRepository customerRepository, IMapper mapper) : ICustomerService
{
    

    public async Task<CustomerDto> AddCustomer(CreateCustomerDto createCustomerDto)
    {
        logger.LogInformation("Added Customer");
        //Add validation for createCustomerDto
        var customer = createCustomerDto.ToCustomer();
        Customer newCustomer = await customerRepository.AddCustomer(customer);
        return new CustomerDto().FromEntity(newCustomer, mapper);
    }

    
    public async Task AddOrderToCustomer(int customerId, OrderDto orderDto)
    {
        logger.LogInformation("Added Order to Customer");
        var customer = await customerRepository.GetCustomerById(customerId);
        if (customer == null)
        {
            var message = $"Customer with ID {customerId} not found.";
            logger.LogError("Error in AddOrderToCustomerAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        var addedOrder = orderDto.ToOrder(mapper);

        await customerRepository.AddOrderToCustomer(customerId, addedOrder);
    }
    
    
    public async Task<IEnumerable<CustomerDto>> GetCustomers()
    {
        logger.LogInformation("Retrieved all Customers");
        var customers = await customerRepository.GetAllCustomers();
        return customers.Select(c => new CustomerDto().FromEntity(c, mapper));

    }

    public async Task<CustomerDto?> GetCustomerById(int id)
    {
        logger.LogInformation("Retrieved Customer via Id");
        var customer = await customerRepository.GetCustomerById(id);
        if (customer != null)
        {
            return new CustomerDto().FromEntity(customer, mapper);
        }
        {
            var message = $"Customer with ID:{id} Not Found";
            logger.LogError("Error in GetCustomerById: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }
    
    public async Task<IEnumerable<CustomerDto>> GetCustomersWithOrders()
    {
        logger.LogInformation("Retrieved Customers with Orders");
        var customers = await customerRepository.GetCustomersWithOrders();
        return customers.Select(c => new CustomerDto().FromEntity(c, mapper));
    }
    

    public async Task UpdateCustomer(UpdateCustomerDto updateCustomerDto)
    {
        logger.LogInformation("Updating Customer");
        if (!CustomerExists(updateCustomerDto.Id))
        {
            var message = $"Customer with ID {updateCustomerDto.Id} not found.";
            logger.LogError("Error in UpdateCustomerAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }
        var customer = updateCustomerDto.ToCustomer();
        //I think this is redundant try/catch because I have nothing in my repository checking
        //for concurrency but...yeah
        try
        {
            await customerRepository.UpdateCustomer(customer);
        }
        catch (DbUpdateConcurrencyException ex)
        {
            logger.LogError("Concurrency error in UpdateCustomerAsync: {Message}", ex.Message);
            throw;
        }
    }
    // I also dont know if this is necessary but its here for now
    private bool CustomerExists(int id)
    {
        return context.Customers.Any(c => c.Id == id);
    }

    public async Task DeleteCustomer(int id)
    {
        logger.LogInformation("Deleted Customer id:{id}", id);
        var customer = await customerRepository.GetCustomerById(id);
        if (customer == null)
        {
            var message = $"Customer with ID {id} not found.";
            logger.LogError("Error in DeleteCustomerAsync: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        await customerRepository.DeleteCustomer(id);

    }
    
}