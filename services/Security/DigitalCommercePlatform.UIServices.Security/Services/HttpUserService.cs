using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalCommercePlatform.UIServices.Security.Models;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Services
{
    public class HttpUserService : IUserService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly string _coreSecurityUrl;
        private readonly string _coreSecurityValidateEndpointUrl;
        private const string AppSettingsNameForCoreSecurityUrl = "Core.Security.Url";

        public HttpUserService(IOptions<AppSettings> appSettingsOptions, IOptions<CoreSecurityEndpointsOptions> coreSecurityEndpointsOptions, IHttpClientFactory clientFactory)
        {
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }
            if (coreSecurityEndpointsOptions == null) { throw new ArgumentNullException(nameof(coreSecurityEndpointsOptions)); }
            _clientFactory = clientFactory ?? throw new ArgumentNullException(nameof(clientFactory));

            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(AppSettingsNameForCoreSecurityUrl) ?? throw new InvalidOperationException($"{AppSettingsNameForCoreSecurityUrl} is missing from AppSettings");
            _coreSecurityValidateEndpointUrl = coreSecurityEndpointsOptions.Value?.Validate ?? throw new InvalidOperationException("Validate key/value is missing from AppSettings");
        }
        public async Task<CoreUserDto> GetUserAsync(string applicationName, string token)
        {
            var requestUrl = _coreSecurityUrl.AppendPathSegment(_coreSecurityValidateEndpointUrl).AppendPathSegment(applicationName);

            var httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl);
            var client = _clientFactory.CreateClient("CoreSecurityClient");

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token); 

            var response = await client.SendAsync(httpRequestMessage).ConfigureAwait(false);
            var coreUserDto = await response.Content.ReadAsAsync<CoreUserDto>().ConfigureAwait(false);
            coreUserDto.StatusCode = (int)response.StatusCode;

            return coreUserDto;
        }
    }
}
