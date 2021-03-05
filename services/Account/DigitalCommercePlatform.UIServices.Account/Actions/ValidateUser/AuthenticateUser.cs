using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser
{
    public sealed class AuthenticateUser
    {
        public class Request : IRequest<Response>
        {
            public Authenticate Criteria { get; set; }
        }

        public class Response
        {
            public string Message { get; set; }
            public bool IsValidUser { get; internal set; }
            public User User { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(AuthenticateModel result)
            {
                Message = result.Message;
                IsValidUser = result.IsValidUser;
                User = result.User;
                IsError = !result.IsValidUser;
            }
        }

        public class AuthenticateUserQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;

            public AuthenticateUserQueryHandler(IAccountService accountQueryService, IMapper mapper)
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var response = await _accountQueryService.AuthenticateUserAsync(request);
                return new Response(response);
            }
        }
    }
}