//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Security.Messages;
using DigitalFoundation.Common.Security.SecurityServiceClient;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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
        private readonly IAppSettings _appSettings;
        private readonly ILogger<SecurityService> _logger;
        private readonly string _validInHouseAccounts;

        public SecurityService(IAppSettings appSettings, IMiddleTierHttpClient middleTierHttpClient, IUIContext context, ILogger<SecurityService> logger)
        {
            _logger = logger;
            _context = context;
            _appSettings = appSettings;
            if (appSettings == null) { throw new ArgumentNullException(nameof(appSettings)); }
            _coreSecurityUrl = appSettings.TryGetSetting("Core.Security.Url");
            _clientId = appSettings.TryGetSetting("Aem.ClientId");
            _clientSecret = appSettings.TryGetSetting("Aem.ClientSecret");
            _validInHouseAccounts = appSettings.GetSetting("Core.Security.HouseAccounts");
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

            var refreshRequest = new Account.Models.Accounts.ClientRevokeTokenRequestModel
            {
                TokenTypeHint = "refresh",
                ClientId = _clientId,
                ClientSecret = _clientSecret,
                Token = _context.User.RefreshToken
            };

            await _middleTierHttpClient.PostAsync<ClientRevokeTokenResponseModel>(url, null, refreshRequest).ConfigureAwait(false);

            var request = new Account.Models.Accounts.ClientRevokeTokenRequestModel
            {
                TokenTypeHint = "bearer",
                ClientId = _clientId,
                ClientSecret = _clientSecret,
                Token = _context.User.AccessToken
            };

            return await _middleTierHttpClient.PostAsync<ClientRevokeTokenResponseModel>(url, null, request).ConfigureAwait(false);
        }

        public bool GetInHouseAccount()
        {
            try
            {
                var customerNumber = _context.User.ActiveCustomer.CustomerNumber;

                if (string.IsNullOrEmpty(customerNumber) || _validInHouseAccounts == null)
                    return false;

                if (_validInHouseAccounts.Contains(customerNumber))
                    return true;
                else
                    return false;
            }
            catch(Exception ex)
            {
                _logger.LogInformation("Error occured while calling In House Account" + ex.Message);
                 return false;
            }
            
        }
    }
}
