using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Settings;
using Flurl;
using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserAndTokenQueryHandler : IRequestHandler<GetUserQuery, GetUserResponse>
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IDistributedCache _cache;
        private readonly string _coreSecurityUrl;
        private readonly string _coreSecurityValidateEndpointUrl;

        public GetUserAndTokenQueryHandler(IHttpClientFactory clientFactory, IDistributedCache cache, IOptions<AppSettings> appSettingsOptions, IOptions<CoreSecurityEndpointsOptions> coreSecurityEndpointsOptions)
        {
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            if (coreSecurityEndpointsOptions == null) { throw new ArgumentNullException(nameof(coreSecurityEndpointsOptions)); }
            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(Globals.CoreSecurityUrl) ?? throw new InvalidOperationException($"{Globals.CoreSecurityUrl} is missing from AppSettings");
            _coreSecurityValidateEndpointUrl = coreSecurityEndpointsOptions.Value?.Validate ?? throw new InvalidOperationException("Validate key/value is missing from AppSettings");
            
            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var token = await _cache.GetStringAsync(request?.SessionId, token: cancellationToken);

            if (string.IsNullOrWhiteSpace(token))
            {
                return new GetUserResponse
                {
                    ErrorCode = "forbidden",
                    ErrorDescription = "No Access Token",
                    ErrorType = SecurityResponseErrorType.Protocol,
                    ExpiresIn = 0,
                    IsError = true,
                    User = null
                };
            }

            var getUserRequestUri = _coreSecurityUrl.AppendPathSegment(_coreSecurityValidateEndpointUrl).AppendPathSegment(request?.ApplicationName);
            var getUserHttpRequestMessage = new HttpRequestMessage(HttpMethod.Get, getUserRequestUri);
            
            var coreSecurityClient = _clientFactory.CreateClient(Globals.CoreSecurityClient);
            coreSecurityClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var getUserHttpResponse = await coreSecurityClient.SendAsync(getUserHttpRequestMessage);
            var getUserResponse = await getUserHttpResponse.Content.ReadAsAsync<GetUserResponse>();
            return getUserResponse;
        }
    }
}
