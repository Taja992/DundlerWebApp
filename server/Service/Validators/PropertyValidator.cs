using FluentValidation;
using Service.TransferModels.Requests.Create;

namespace Service.Validators;

public class PropertyValidator : AbstractValidator<CreatePropertyDto>
{
    public PropertyValidator()
    {
        RuleFor(x => x.PropertyName).NotEmpty().WithMessage("Property requires a description");
    }
    
}