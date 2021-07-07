using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public class ValidatorBase<T> : AbstractValidator<T> where T : RequestBase
    {
        public ValidatorBase()
        {
            RuleFor(x => x.AccessToken).NotNull().MinimumLength(2);
        }

    }
}