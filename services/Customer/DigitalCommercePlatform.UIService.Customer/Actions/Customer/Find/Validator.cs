using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Find
{
    public class Validator : AbstractValidator<FindCustomerRequest>
    {
        public Validator()
        {
            RuleFor(c => c.Id).NotNull().NotEmpty();
        }
    }
}
