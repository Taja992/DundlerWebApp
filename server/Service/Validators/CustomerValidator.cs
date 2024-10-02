using System.ComponentModel;
using FluentValidation;
using Service.TransferModels.Requests.Create;
using Service.TransferModels.Requests.Update;

namespace Service.Validators;

public class CustomerValidator : AbstractValidator<CreateCustomerDto>
{
    public CustomerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name must not be empty");
        RuleFor(x => x.Email).Must(BeAValidEmail).WithMessage("Invalid Email format");
        RuleFor(x => x.Phone).Must(BeAValidPhone).WithMessage("Invalid phone format");
    }

        private static bool BeAValidEmail(string? email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            try
            {
                var address = new System.Net.Mail.MailAddress(email);
                return address.Address == email;
            }
            catch
            {
                return false;
            }
        }

    private static bool BeAValidPhone(string? phone)
    {
        return !string.IsNullOrEmpty(phone) && phone.All(c => char.IsDigit(c) || c == '+' || c == ' ' || c == '-');
    }
}

public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerDto>
{
    public UpdateCustomerValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Name must not be empty");
        RuleFor(x => x.Email).Must(BeAValidEmail).WithMessage("Invalid Email format");
        RuleFor(x => x.Phone).Must(BeAValidPhone).WithMessage("Invalid phone format");
    }

    private static bool BeAValidEmail(string? email)
    {
        if (string.IsNullOrEmpty(email))
            return false;

        try
        {
            var address = new System.Net.Mail.MailAddress(email);
            return address.Address == email;
        }
        catch
        {
            return false;
        }
    }

    private static bool BeAValidPhone(string? phone)
    {
        return !string.IsNullOrEmpty(phone) && phone.All(c => char.IsDigit(c) || c == '+' || c == ' ' || c == '-');
    }
}