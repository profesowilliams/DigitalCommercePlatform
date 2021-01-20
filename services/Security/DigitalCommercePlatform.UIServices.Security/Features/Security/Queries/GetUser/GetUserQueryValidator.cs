using FluentValidation;
using System.Net.Http.Headers;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
    {
        public GetUserQueryValidator()
        {
            RuleFor(p => p.ApplicationName).NotEmpty().WithMessage("{PropertyName} is required.").NotNull();
            RuleFor(p => p.SessionId).NotEmpty().WithMessage("{PropertyName} is required.").NotNull();

            //RuleFor(p => p.Authorization).Must(ProperAuthorizationHeaderFormat).WithMessage("Authorization Header format should be: Bearer Value");
        }

        private bool ProperAuthorizationHeaderFormat(string header)
        {
            if (AuthenticationHeaderValue.TryParse(header, out var headerValue))
            {
                var scheme = headerValue.Scheme;
                var parameter = headerValue.Parameter;

                if (scheme == "Bearer" && !string.IsNullOrWhiteSpace(parameter))
                {
                    return true;
                }
            }

            return false;
        }
    }
}
