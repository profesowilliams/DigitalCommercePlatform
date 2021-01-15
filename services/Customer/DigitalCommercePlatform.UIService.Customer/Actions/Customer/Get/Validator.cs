using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get
{
    public class Validator : AbstractValidator<GetCustomerRequest>
    {
        public Validator()
        {
            RuleFor(c => c.Id).NotNull().NotEmpty();
        }
    }
}
