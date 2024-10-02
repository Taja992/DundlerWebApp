using FluentValidation;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;

namespace Service.Validators;

public class PaperValidator : AbstractValidator<CreatePaperDto>
{
    public PaperValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Must have name");
        RuleFor(x => x.Discontinued).NotEmpty().WithMessage("Is product discontinued or not?");
        RuleFor(x => x.Stock).NotEmpty().WithMessage("Stock cannot be left empty")
            .GreaterThanOrEqualTo(0).WithMessage("Stock must be 0 or above.");
        RuleFor(x => x.Price).NotEmpty().WithMessage("Price cannot be left empty")
            .GreaterThanOrEqualTo(0).WithMessage("Price must be 0 or above");

    }
 }

public class UpdatePaperValidator : AbstractValidator<UpdatePaperDto>
{
    public UpdatePaperValidator()
    {
        RuleFor(x => x.Stock).GreaterThanOrEqualTo(0).WithMessage("Stock must be 0 or above.");
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Price must be 0 or above");
    }
}