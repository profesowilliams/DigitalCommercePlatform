using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.GetUser
{
    public sealed class GetUser
    {
        public class Request : IRequest<Response>
        {
            public string ApplicationName { get; }
            public string SessionId { get; }

            public Request(string applicationName, string sessionId)
            {
                ApplicationName = applicationName;
                SessionId = sessionId;
            }
        }

        public class Response
        {
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }
            public string Message { get; set; }
            public User UserDetails { get; set; }

            public Response(User details)
            {
                UserDetails = details;
            }
        }

        public class GetUserQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;

            public GetUserQueryHandler(IAccountService accountQueryService, IMapper mapper)
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userDto = await _accountQueryService.GetUserAsync(request);
                return new Response(userDto);
            }
        }
    }
}