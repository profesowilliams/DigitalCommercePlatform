using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
    {
        public GetUserQueryValidator()
        {
            RuleFor(p => p.ApplicationName).NotEmpty().WithMessage("{PropertyName} is required.");
            RuleFor(p => p.SessionId).NotEmpty().WithMessage("{PropertyName} is required.");
        }
    }
}
