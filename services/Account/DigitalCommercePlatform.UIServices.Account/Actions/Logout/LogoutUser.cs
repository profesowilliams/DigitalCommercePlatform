using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalFoundation.Common.Cache.UI;
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
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string SessionId { get; }

            public Request(string sessionId)
            {
                SessionId = sessionId;
            }
        }

        public class Response
        {
            public string Message { get; set; }
        }

        public class LogoutUserQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;

            public LogoutUserQueryHandler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                _sessionIdBasedCacheProvider.Remove("User");

                return await Task.FromResult( new ResponseBase<Response> { Content = new Response { Message = "User logged out successfully" } });
            }
        }
    }
}
