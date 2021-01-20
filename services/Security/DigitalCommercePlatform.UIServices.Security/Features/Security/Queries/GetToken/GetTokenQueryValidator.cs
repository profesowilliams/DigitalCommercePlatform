using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    public class GetTokenQueryValidator : AbstractValidator<GetTokenQuery>
    {
        public GetTokenQueryValidator()
        {
            RuleFor(p => p.Code).NotEmpty().WithMessage("{PropertyName} is required.").NotNull();
            RuleFor(p => p.RedirectUri).NotEmpty().WithMessage("{PropertyName} is required.").NotNull();
            RuleFor(p => p.SessionId).NotEmpty().WithMessage("{PropertyName} is required.").NotNull();
        }
    }
}
