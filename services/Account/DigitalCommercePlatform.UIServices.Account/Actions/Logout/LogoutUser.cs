using DigitalFoundation.Common.Cache.UI;
using FluentValidation;
using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.Logout
{
    [ExcludeFromCodeCoverage]
    public sealed class LogoutUser
    {
        public class Request : IRequest<Response>
        {
            public string SessionId { get; }

            public Request(string sessionId)
            {
                SessionId = sessionId;
            }
        }

        public class Response
        {
            public virtual bool IsError { get; set; }
            public string Message { get; set; }
        }

        public class RequestValidator : AbstractValidator<Request>
        {
            public RequestValidator()
            {
                RuleFor(p => p.SessionId).NotEmpty().WithMessage("SessionId is required.");
            }
        }

        public class LogoutUserQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;

            public LogoutUserQueryHandler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                _sessionIdBasedCacheProvider.Remove("User");

                return await Task.FromResult( new Response { IsError = false, Message = "User logged out successfully" });
            }
        }
    }
}
