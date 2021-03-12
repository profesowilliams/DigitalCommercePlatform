using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.GetUser
{
    [ExcludeFromCodeCoverage]
    public sealed class GetUser
    {
        public class Request : IRequest<Response>
        {
            public string ApplicationName { get; }

            public Request(string applicationName)
            {
                ApplicationName = applicationName;
            }
        }

        public class Response
        {
            public virtual bool IsError { get; set; }
            public User User { get; set; }
        }

        public class GetUserQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly IMapper _mapper;

            public GetUserQueryHandler(ISessionIdBasedCacheProvider sessionIdBasedCacheProvider, IMapper mapper)
            {
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var userFromCache = _sessionIdBasedCacheProvider.Get<DigitalFoundation.Common.Models.User>("User");

                var user = _mapper.Map<User>(userFromCache);
                var response = new Response { User = user };
                return await Task.FromResult(response);

            }
        }
    }
}