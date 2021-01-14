using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace DigitalCommercePlatform.UIServices.Security.Requests
{
    public class UserAndTokenRequest
    {
        [FromHeader]
        public string ApplicationName { get; set; }

        [FromHeader]
        public string SessionId { get; set; }
    }

    //public class UserAndTokenRequestValidator : AbstractValidator<UserAndTokenRequest>
    //{
    //    public UserAndTokenRequestValidator()
    //    {
    //        RuleFor(p => p.SessionId)
    //            .NotEmpty().WithMessage("{PropertyName} is required.")
    //            .NotNull()
    //            .MaximumLength(50).WithMessage("{PropertyName} must not exceed 10 characters.");
    //    }
    //}
}
