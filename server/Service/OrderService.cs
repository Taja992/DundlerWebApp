﻿using AutoMapper;
using DataAccess;
using DataAccess.Interfaces;
using DataAccess.Models;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Service.TransferModels.DTOs;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;


namespace Service;



public interface IOrderService
{
    Task<OrderDto> CreateOrder(CreateOrderDto createOrderDto);
    Task<IEnumerable<OrderDto>> GetOrders();
    Task<OrderDto?> GetOrder(int id);
    Task<IEnumerable<OrderDto>> GetOrdersByCustomerId(int customerId);
    Task UpdateOrder(UpdateOrderDto updateOrderDto);
    Task DeleteOrder(int id);
    Task<OrderDto> CreateOrderWithEntries(CreateOrderWithEntriesDto createOrderWithEntriesDto);
}

public class OrderService(DunderMifflinContext context, ILogger<CustomerService> logger,
    IOrderRepository orderRepository, 
    IMapper mapper, 
    IValidator<CreateOrderDto> createValidator, 
    IValidator<UpdateOrderDto> updateValidator) : IOrderService
{
    //     As a customer I want to be able to place an order with X order entries of products.
    //     This involves creating a new order with multiple order entries.
    
    //     As a business admin I want to see order history for all customers.
    //     This involves retrieving the order history for all customers.
    
    //     As a business admin I want to be able to change the status of an order.
    //     This involves updating the status of an existing order.
    public async Task<OrderDto> CreateOrder(CreateOrderDto createOrderDto)
    {
        await createValidator.ValidateAndThrowAsync(createOrderDto);
        var order = createOrderDto.ToOrder();
        order.Status = "Pending"; // Force newly created orders to be Pending
        order.TotalAmount = 0; //set this to 0 at first to avoid null
        Order newOrder = await orderRepository.CreateOrder(order);
        return new OrderDto().FromEntity(newOrder, mapper);
    }
    

    public async Task<IEnumerable<OrderDto>> GetOrders()
    {
        var orders = await orderRepository.GetOrders();
        return orders.Select(o => new OrderDto().FromEntity(o, mapper));
    }

    public async Task<OrderDto?> GetOrder(int id)
    {
        var order = await orderRepository.GetOrder(id);
        if (order != null)
        {
            return new OrderDto().FromEntity(order, mapper);
        }
        {
            var message = $"Order with ID:{id} Not Found";
            logger.LogError("Error in GetOrder: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }

    public async Task<IEnumerable<OrderDto>> GetOrdersByCustomerId(int customerId)
    {
        var order = await orderRepository.GetOrdersByCustomerId(customerId);
        return order.Select(o => new OrderDto().FromEntity(o, mapper));
    }

    public async Task UpdateOrder(UpdateOrderDto updateOrderDto)
    {
        await updateValidator.ValidateAndThrowAsync(updateOrderDto);
        var order = updateOrderDto.ToOrder();
        try
        {
            await orderRepository.UpdateOrder(order);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (OrderExists(order.Id))
            {
                logger.LogError("Concurrency error in UpdateOrder for order ID {OrderId}", order.Id);
                throw;
            }
            var message = $"Order with ID {order.Id} not found.";
            logger.LogError("Error in UpdateOrder: {Message}", message);
            throw new KeyNotFoundException(message);
        }
    }

    private bool OrderExists(int id)
    {
        return context.Orders.Any(e => e.Id == id);
    }

    public async Task DeleteOrder(int id)
    {
        var order = await orderRepository.GetOrder(id);
        if (order == null)
        {
            var message = $"Order with ID {id} not found.";
            logger.LogError("Error in DeleteOrder: {Message}", message);
            throw new KeyNotFoundException(message);
        }

        await orderRepository.DeleteOrder(id);
    }

    public async Task<OrderDto> CreateOrderWithEntries(CreateOrderWithEntriesDto createOrderWithEntriesDto)
    {
        var order = mapper.Map<Order>(createOrderWithEntriesDto);
        await orderRepository.AddOrderWithEntries(order);
        return mapper.Map<OrderDto>(order);
    }
}

