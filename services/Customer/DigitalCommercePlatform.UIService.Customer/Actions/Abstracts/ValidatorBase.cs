using FluentValidation;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.Actions.Abstracts
{
    [ExcludeFromCodeCoverage]
    public class ValidatorBase<T> : AbstractValidator<T> where T : RequestBase
    {
        public ValidatorBase()
        {

        }
    }
}
