using DigitalCommercePlatform.UIServices.Security.DTO.Request;
using FluentValidation;

namespace DigitalCommercePlatform.UIServices.Security.Validators
{
    public class ValidateUserRequestValidator : AbstractValidator<ValidateUserRequest>
    {
        public ValidateUserRequestValidator()
        {
            RuleFor(request => request.ApplicationName).NotEmpty();
            RuleFor(request => request.Site).NotEmpty();
            RuleFor(request => request.Consumer).NotEmpty();
            RuleFor(request => request.AcceptLanguage).NotEmpty();
            RuleFor(request => request.Authorization).NotEmpty();
        }
    }
}
