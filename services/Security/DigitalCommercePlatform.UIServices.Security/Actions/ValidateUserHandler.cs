using DigitalCommercePlatform.UIServices.Security.DTO.Request;
using DigitalCommercePlatform.UIServices.Security.DTO.Response;
using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Actions
{
    public class ValidateUserHandler : IRequestHandler<ValidateUserRequest, ValidateUserResponse>
    {
        private readonly ILogger<ValidateUserHandler> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreSecurityUrl;
        private readonly string _coreSecurityValidateEndpointUrl;


        public ValidateUserHandler(ILogger<ValidateUserHandler> logger, IOptions<AppSettings> appSettingsOptions
                                    ,IOptions<CoreSecurityEndpointsOptions> coreSecurityEndpointsOptions, IHttpClientFactory clientFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            if (coreSecurityEndpointsOptions == null) { throw new ArgumentNullException(nameof(coreSecurityEndpointsOptions)); }
            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));

            const string appSettingsNameForCoreSecurityUrl = "Core.Security.Url";
            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(appSettingsNameForCoreSecurityUrl) ?? throw new InvalidOperationException($"{appSettingsNameForCoreSecurityUrl} is missing from AppSettings");
            _coreSecurityValidateEndpointUrl = coreSecurityEndpointsOptions.Value?.Validate ?? throw new InvalidOperationException("Validate key/value is missing from AppSettings");
        }

        public async Task<ValidateUserResponse> Handle(ValidateUserRequest request, CancellationToken cancellationToken)
        {
            var requestUrl = _coreSecurityUrl.AppendPathSegment(_coreSecurityValidateEndpointUrl).AppendPathSegment(request?.ApplicationName);

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl);
            var client = _clientFactory.CreateClient("CoreSecurityClient");
            var response = await client.SendAsync(requestMessage,cancellationToken).ConfigureAwait(false);
            var validateUserResponse = await response.Content.ReadAsAsync<ValidateUserResponse>().ConfigureAwait(false);
            validateUserResponse.HttpStatusCode = response.StatusCode;
            return validateUserResponse;
        }
    }
}
