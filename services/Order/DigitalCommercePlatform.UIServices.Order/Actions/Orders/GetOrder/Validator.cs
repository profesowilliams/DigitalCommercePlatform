using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Orders.GetOrder
{
    public class Validator : AbstractValidator<GetOrderRequest>
    {
        public Validator()
        {
            RuleFor(c => c.Id).NotNull().NotEmpty();
        }
    }
}
