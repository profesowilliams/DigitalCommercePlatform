//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using System;
using System.Collections.Generic;
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

        [ExcludeFromCodeCoverage]
        public class LogoutUserQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly ISecurityService _securityService;

            public LogoutUserQueryHandler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, ISecurityService securityService)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider ?? throw new ArgumentNullException(nameof(sessionIdBasedCacheProvider));
                _securityService = securityService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                
                var result = await _securityService.RevokePingTokenAsync(request.SessionId);

                if (result.IsError)                
                    return await Task.FromResult(new ResponseBase<Response> { Error = new ErrorInformation { IsError = true, Messages = new List<string> { result.ErrorDescription, result.ErrorCode, result.ErrorType.ToString() }, Code = 500 } });

                _sessionIdBasedCacheProvider.Remove("User");

                return await Task.FromResult(new ResponseBase<Response> { Content = new Response { Message = "User logged out successfully" } });
            }
        }
    }
}
