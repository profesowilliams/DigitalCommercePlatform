using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Content.Actions.Abstract
{
    public class ValidatorBase<T> : AbstractValidator<T> where T : RequestBase
    {
        public ValidatorBase()
        {
            RuleFor(x => x.AccessToken).NotNull().MinimumLength(2);
        }

    }
}