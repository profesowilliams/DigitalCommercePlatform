using DigitalCommercePlatform.UIServices.Browse.Actions.Browse.GetBrowse;
using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browses.GetBrowse
{
    public class Validator : AbstractValidator<GetBrowseRequest>
    {
        public Validator()
        {
            RuleFor(c => c.Id).NotNull().NotEmpty();
        }
    }
}
