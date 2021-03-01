using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Config.Actions.Abstract
{
    public class ValidatorBase<T> : AbstractValidator<T> where T : RequestBase
    {
        public ValidatorBase()
        {
            RuleFor(x => x.AccessToken).NotNull().MinimumLength(2);
        }

    }
}