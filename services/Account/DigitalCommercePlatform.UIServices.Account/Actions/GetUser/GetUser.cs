//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.GetUser
{
    [ExcludeFromCodeCoverage]
    public sealed class GetUser
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
            public User User { get; set; }
        }

        public class GetUserQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly IMapper _mapper;

            public GetUserQueryHandler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IMapper mapper)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var userFromCache = _sessionIdBasedCacheProvider.Get<DigitalFoundation.Common.Models.User>("User");
                var user = _mapper.Map<User>(userFromCache);

                var response = new ResponseBase<Response> { Content = new Response { User = user } };
                return await Task.FromResult(response);
            }
        }
    }
}
