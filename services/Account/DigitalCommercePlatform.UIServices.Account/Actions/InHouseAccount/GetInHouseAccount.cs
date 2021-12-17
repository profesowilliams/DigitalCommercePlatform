//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Cache;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.InHouseAccount
{
    public sealed class GetInHouseAccount
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string ApplicationName { get; }

            public Request(string applicationName)
            {
                ApplicationName = applicationName;
            }
        }

        public class Response
        {
            public bool IsHouseAccount { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly ISecurityService _securityService;
            private readonly IMapper _mapper;

            public Handler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IMapper mapper,ISecurityService securityService)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider;
                _securityService = securityService;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var hasAccount = _securityService.GetInHouseAccount();
                var response = new ResponseBase<Response> { Content = new Response { IsHouseAccount = hasAccount } };
                return await Task.FromResult(response);
            }
        }
    }
}
