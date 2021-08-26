//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using DigitalFoundation.Common.Settings;
using Flurl;
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
        private readonly IUIContext _context;

        public SecurityService(IAppSettings appSettings, IMiddleTierHttpClient middleTierHttpClient, IUIContext context)
        {
            if (appSettings == null) { throw new ArgumentNullException(nameof(appSettings)); }

            _coreSecurityUrl = appSettings.TryGetSetting(Globals.CoreSecurityUrl) ??
                                                        throw new InvalidOperationException($"{Globals.CoreSecurityUrl} is missing from AppSettings");

            _clientId = appSettings.TryGetSetting(Globals.AemClientId) ??
                                                        throw new InvalidOperationException($"{Globals.AemClientId} is missing from AppSettings");

            _clientSecret = appSettings.TryGetSetting(Globals.AemClientSecret) ??
                                                        throw new InvalidOperationException($"{Globals.AemClientSecret} is missing from AppSettings");

            _context = context;

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

        public async Task<ClientRevokeTokenResponseModel> RevokePingTokenAsync(string sessionId)
        {
            var url = _coreSecurityUrl.AppendPathSegment("revoketoken");

            var request = new Account.Models.Accounts.ClientRevokeTokenRequestModel
            {
                TokenTypeHint = "password",
                ClientId = _clientId,
                ClientSecret = _clientSecret,
                Token = _context.User.AccessToken
            };

            return await _middleTierHttpClient.PostAsync<ClientRevokeTokenResponseModel>(url, null, request).ConfigureAwait(false);
        }
    }
}
