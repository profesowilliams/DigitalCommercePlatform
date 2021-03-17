using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Cache.UI;
using FluentValidation;
using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser
{
    [ExcludeFromCodeCoverage]
    public sealed class AuthenticateUser
    {
        public class Request : IRequest<Response>
        {
            public string Code { get; }
            public string RedirectUri { get; }
            public string ApplicationName { get; set; }
            public string TraceId { get; }
            public string Language { get; }
            public string Consumer { get; }
            public string SessionId { get; }

            public Request(string code, string redirectUri, string applicationName, string traceId, string language, string consumer, string sessionId)
            {
                Code = code;
                RedirectUri = redirectUri;
                TraceId = traceId;
                Language = language;
                Consumer = consumer;
                SessionId = sessionId;
                ApplicationName = applicationName;
            }
        }

        public class Response
        {
            public virtual bool IsError { get; set; }
            public User User { get; set; }
        }

        public class RequestValidator : AbstractValidator<Request>
        {
            public RequestValidator()
            {
                RuleFor(p => p.Code).NotEmpty().WithMessage("Code is required.");
                RuleFor(p => p.RedirectUri).NotEmpty().WithMessage("RedirectUri is required.");
                RuleFor(p => p.TraceId).NotEmpty().WithMessage("TraceId is required.");
                RuleFor(p => p.Language).NotEmpty().WithMessage("Language is required.");
                RuleFor(p => p.Consumer).NotEmpty().WithMessage("Consumer is required.");
                RuleFor(p => p.SessionId).NotEmpty().WithMessage("SessionId is required.");
                RuleFor(p => p.ApplicationName).NotEmpty().WithMessage("ApplicationName is required.");
            }
        }

        public class AuthenticateUserQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly ISecurityService _securityService;
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            

            public AuthenticateUserQueryHandler(ISecurityService securityService, ISessionIdBasedCacheProvider sessionIdBasedCacheProvider)
            {
                _securityService = securityService ?? throw new ArgumentNullException(nameof(securityService));
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var accessToken = await _securityService.GetToken(request.Code, request.RedirectUri, request.TraceId, request.Language, request.Consumer);

                if (string.IsNullOrEmpty(accessToken))
                {
                    return new Response { IsError = true };
                }

                var user = await _securityService.GetUser(accessToken, request.ApplicationName, request.TraceId, request.Language, request.Consumer);

                if (user == null)
                {
                    return new Response { IsError = true };
                }

                _sessionIdBasedCacheProvider.Put("User", user, 86400);

                var response = new Response { IsError = false, User = user };
                return response;
            }
        }
    }
}