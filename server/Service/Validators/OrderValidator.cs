using FluentValidation;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;

namespace Service.Validators;

public class OrderValidator : AbstractValidator<CreateOrderDto>
{
    private static readonly string[] ValidStatuses =
        { "Pending", "Processing", "Confirmed", "Shipped", "On Hold", "Completed", "Failed" };

    public OrderValidator()
    {
        RuleFor(x => x.OrderDate).NotEmpty().WithMessage("Order date must not be empty");
        RuleFor(x => x.DeliveryDate).Must((dto, deliveryDate) => BeAfterOrderDate(dto.OrderDate, deliveryDate))
            .WithMessage("Delivery date must be after order date.");
        RuleFor(x => x.TotalAmount).GreaterThanOrEqualTo(0).WithMessage("Total amount must be above 0");
        RuleFor(x => x.Status).Must(BeAValidStatus).WithMessage("Invalid Status");
    }

    private static bool BeAfterOrderDate(DateTime orderDate, DateOnly? deliveryDate)
    {
        if (deliveryDate == null)
            return true; //no delivery date is ok
        return deliveryDate.Value.ToDateTime(TimeOnly.MinValue) > orderDate;
    }

    private static bool BeAValidStatus(string? status)
    {
        return ValidStatuses.Contains(status);
    }
}

public class UpdateOrderValidator : AbstractValidator<UpdateOrderDto>
{
    private static readonly string[] ValidStatuses = { "Pending", "Processing", "Confirmed", "Shipped", "On Hold", "Completed", "Failed" };

    public UpdateOrderValidator()
    {
        RuleFor(x => x.OrderDate).NotEmpty().WithMessage("Order date must not be empty");
        RuleFor(x => x.DeliveryDate).Must((dto, deliveryDate) => BeAfterOrderDate(dto.OrderDate, deliveryDate))
            .WithMessage("Delivery date must be after order date.");
        RuleFor(x => x.TotalAmount).GreaterThanOrEqualTo(0).WithMessage("Total amount must be non-negative");
        RuleFor(x => x.Status).Must(BeAValidStatus).WithMessage("Invalid status");
    }
    
    private static bool BeAfterOrderDate(DateTime orderDate, DateOnly? deliveryDate)
    {
        if (deliveryDate == null)
            return true; //no delivery date is ok
        return deliveryDate.Value.ToDateTime(TimeOnly.MinValue) > orderDate;
    }

    private static bool BeAValidStatus(string? status)
    {
        return ValidStatuses.Contains(status);
    }
}