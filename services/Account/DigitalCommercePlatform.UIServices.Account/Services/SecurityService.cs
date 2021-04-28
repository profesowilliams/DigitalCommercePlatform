using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    [ExcludeFromCodeCoverage]
    public class SecurityService : ISecurityService
    {
        private readonly string _coreSecurityUrl;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;

        public SecurityService(IOptions<AppSettings> appSettingsOptions, IMiddleTierHttpClient middleTierHttpClient)
        {
            if (appSettingsOptions == null) { throw new ArgumentNullException(nameof(appSettingsOptions)); }

            _coreSecurityUrl = appSettingsOptions.Value?.TryGetSetting(Globals.CoreSecurityUrl) ?? 
                                                        throw new InvalidOperationException($"{Globals.CoreSecurityUrl} is missing from AppSettings");

            _clientId = appSettingsOptions.Value?.TryGetSetting(Globals.AemClientId) ??
                                                        throw new InvalidOperationException($"{Globals.AemClientId} is missing from AppSettings");

            _clientSecret = appSettingsOptions.Value?.TryGetSetting(Globals.AemClientSecret) ??
                                                        throw new InvalidOperationException($"{Globals.AemClientSecret} is missing from AppSettings");

            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
        }

        public async Task<ClientLoginCodeTokenResponseModel> GetToken(string code, string redirectUri)
        {
            var clientLoginCodeTokenRequest = new ClientLoginCodeTokenRequestModel()
            {
                Address = _coreSecurityUrl,
                ClientId = _clientId,
                ClientSecret = _clientSecret,
                Code = code,
                RedirectUri = new Uri(redirectUri)
            };

            var tokenResponseDto = await _middleTierHttpClient.GetLoginCodeTokenAsync(clientLoginCodeTokenRequest);
            return tokenResponseDto;
        }

        public async Task<ValidateUserResponseModel> GetUser(string applicationName)
        {
            var userResponseDto = await _middleTierHttpClient.ValidateUserAsync(new ValidateUserRequestModel
            {
                Address = _coreSecurityUrl,
                ApplicationName = applicationName
            });

            return userResponseDto;
        }
    }
}
