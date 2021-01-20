using AutoMapper;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
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
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _coreSecurityUrl;
        private const string AppSettingsNameForCoreSecurityUrl = "Core.Security.Url";
        private readonly IMapper _mapper;
        private readonly IDistributedCache _cache;


        public GetUserAndTokenQueryHandler(IMiddleTierHttpClient middleTierHttpClient, IOptions<AppSettings> appSettingsOptions, IMapper mapper, IDistributedCache cache)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(AppSettingsNameForCoreSecurityUrl) ?? throw new InvalidOperationException($"{AppSettingsNameForCoreSecurityUrl} is missing from AppSettings");
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<GetUserResponse> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var token = await _cache.GetStringAsync(request?.SessionId, token: cancellationToken).ConfigureAwait(false);

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


            ////////////////////////////// Start of temporary code 


            GetUserResponse test = null;

            using (var httpClient = new HttpClient())
            {
                using (var request1 = new HttpRequestMessage(new HttpMethod("GET"), "http://core-security/v1/validate/adobeEM"))
                {
                    request1.Headers.TryAddWithoutValidation("Site", "ecom.apps.web.aem");
                    request1.Headers.TryAddWithoutValidation("Authorization", "Bearer " +  token);
                    request1.Headers.TryAddWithoutValidation("Consumer", "f");
                    request1.Headers.TryAddWithoutValidation("Accept-Language", "en");

                    var response1 = await httpClient.SendAsync(request1);
                    test = await response1.Content.ReadAsAsync<GetUserResponse>().ConfigureAwait(false);
                }
            }

            ///////////////////////////////// stop of temporary code 


            var validateUserRequestModel = new ValidateUserRequestModel
            {
                Address = _coreSecurityUrl,
                ApplicationName = request?.ApplicationName,
                Token = token
            };

            // this call by core security SecurityServiceClientExtension stops to work
            // need to investigate. Yesterday it was working :) meanwhile temp code is working
            var userDto = await _middleTierHttpClient.ValidateUserAsync(validateUserRequestModel).ConfigureAwait(false);

            var userResponse = _mapper.Map<GetUserResponse>(userDto);

            ////////////////
            userResponse = test;
            ///////////////

            return userResponse;
        }
    }
}
