using AutoMapper;
using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    public class GetTokenQueryHandler : IRequestHandler<GetTokenQuery, GetTokenResponse>
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly IMapper _mapper;
        private readonly string _coreSecurityUrl;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private const string AppSettingsNameForCoreSecurityUrl = "Core.Security.Url";

        public GetTokenQueryHandler(IOptions<AppSettings> appSettingsOptions, IOptions<OAuthClientDetailsOptions> oauthClientDetailsOptions,
                                                        IMiddleTierHttpClient middleTierHttpClient, IMapper mapper)
        {
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            if (oauthClientDetailsOptions == null) { throw new ArgumentNullException(nameof(oauthClientDetailsOptions)); }
            if (middleTierHttpClient == null) { throw new ArgumentNullException(nameof(middleTierHttpClient)); }
            if (mapper == null) { throw new ArgumentNullException(nameof(mapper)); }

            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(AppSettingsNameForCoreSecurityUrl) ?? throw new InvalidOperationException($"{AppSettingsNameForCoreSecurityUrl} is missing from AppSettings");
            _clientId = oauthClientDetailsOptions.Value?.ClientId ?? throw new InvalidOperationException("ClientId key/value is missing from AppSettings");
            _clientSecret = oauthClientDetailsOptions.Value?.ClientSecret ?? throw new InvalidOperationException("ClientSecret key/value is missing from AppSettings");

            _middleTierHttpClient = middleTierHttpClient;
            _mapper = mapper;
        }

        public async Task<GetTokenResponse> Handle(GetTokenQuery request, CancellationToken cancellationToken)
        {
            var clientLoginCodeTokenRequest = new ClientLoginCodeTokenRequestModel()
            {
                Address = _coreSecurityUrl,
                ClientId = _clientId,
                ClientSecret = _clientSecret,
                Code = request?.Code,
                RedirectUri = new Uri(request?.RedirectUri)
            };

            var tokenDto = await _middleTierHttpClient.GetLoginCodeTokenAsync(clientLoginCodeTokenRequest).ConfigureAwait(false);

            var tokenResponse = _mapper.Map<GetTokenResponse>(tokenDto);

            return tokenResponse;
        }
    }
}
