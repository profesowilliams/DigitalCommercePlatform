using FluentValidation;

namespace DigitalCommercePlatform.UIService.Customer.Actions.Abstracts
{
    public class ValidatorBase<T> : AbstractValidator<T> where T : RequestBase
    {
        public ValidatorBase()
        {

        }
    }
}
