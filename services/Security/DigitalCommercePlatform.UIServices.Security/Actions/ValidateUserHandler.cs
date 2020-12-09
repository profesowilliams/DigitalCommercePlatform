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
        private readonly CoreSecurityEndpointsOptions _coreSecurityEndpointsOptions;
        private readonly ILogger<ValidateUserHandler> _logger;
        private readonly IHttpClientFactory _clientFactory;
        private readonly string CoreSecurityUrl;

        public ValidateUserHandler(ILoggerFactory loggerFactory,IOptions<AppSettings> options
            ,IOptions<CoreSecurityEndpointsOptions> coreSecurityEndpointsOptions, IHttpClientFactory clientFactory)
        {
            _logger = loggerFactory.CreateLogger<ValidateUserHandler>();
            _clientFactory = clientFactory;
            _coreSecurityEndpointsOptions = coreSecurityEndpointsOptions.Value;

            const string key = "Core.Security.Url";
            CoreSecurityUrl = options?.Value?.TryGetSetting(key);
            if (CoreSecurityUrl is null) throw new InvalidOperationException($"{key} is missing from {nameof(IOptions<AppSettings>)}");
        }

        public async Task<ValidateUserResponse> Handle(ValidateUserRequest request, CancellationToken cancellationToken)
        {
            var url = CoreSecurityUrl.AppendPathSegment(_coreSecurityEndpointsOptions.Validate).AppendPathSegment(request.ApplicationName);

            var requestMessage = new HttpRequestMessage(HttpMethod.Get, url);
            var client = _clientFactory.CreateClient("CoreSecurityClient");
            var response = await client.SendAsync(requestMessage,cancellationToken).ConfigureAwait(false);
            var validateUserResponse = await response.Content.ReadAsAsync<ValidateUserResponse>().ConfigureAwait(false);
            validateUserResponse.HttpStatusCode = response.StatusCode;
            return validateUserResponse;
        }
    }
}
