//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Security.Token;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure
{
    public class DigitalFoundationClient : IDigitalFoundationClient
    {
        private readonly ILogger<DigitalFoundationClient> _logger;
        private readonly ISimpleHttpClient _simpleHttpClient;
        private readonly ITokenManagerService _tokenManagerService;

        public DigitalFoundationClient(
            ILoggerFactory loggerFactory,
            ISimpleHttpClient simpleHttpClient,
            ITokenManagerService tokenManagerService)
        {
            _logger = loggerFactory.CreateLogger<DigitalFoundationClient>();
            _simpleHttpClient = simpleHttpClient;
            _tokenManagerService = tokenManagerService;
        }

        private const string Scope = "df.orders";
        private const string ClientIdKey = "UI.Nuance.ServiceToken.ClientId";
        private const string ClientSecretKey = "UI.Nuance.ServiceToken.ClientSecret";

        public async Task<TResp> GetAsync<TResp>(string endpoint, string userId)
        {
            var impersonationHeader = new Dictionary<string, string>()
            {
                { HeadersList.ImpersonateUserHeader, userId }
            };
            return await GetAsync<TResp>(endpoint, null, null, impersonationHeader);
        }

        public async Task<TResp> GetAsync<TResp>(string endpoint, IEnumerable<object> routeParams = null,
            IDictionary<string, object> queryParams = null, IDictionary<string, string> customHeaders = null)
        {
            _logger.LogDebug($"Getting data for: {endpoint}");

            var headers = _tokenManagerService.GenerateAndAddAuthToken(Scope, ClientIdKey, ClientSecretKey);
            if (customHeaders != null)
                foreach (var item in customHeaders)
                {
                    headers.Add(item);
                }

            AddMandatoryRequestHeaders(headers);

            try
            {
                var response = await _simpleHttpClient.GetAsync<TResp>(endpoint, routeParams, queryParams, headers);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during getting data");
                throw;
            }
        }

        private void AddMandatoryRequestHeaders(IDictionary<string, string> headers)
        {
            headers.Add(HeadersList.SiteHeader, "US");
            headers.Add(HeadersList.TraceIdHeader, Guid.NewGuid().ToString());
            headers.Add(HeadersList.ConsumerHeader, "Nuance");
            headers.Add(HeadersList.AcceptLanguageHeader, "en-US");
        }
    }
}
