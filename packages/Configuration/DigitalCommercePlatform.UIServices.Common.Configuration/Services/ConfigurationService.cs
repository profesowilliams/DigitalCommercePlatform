using DigitalCommercePlatform.UIServices.Common.Configuration.Contracts;
using DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Services
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationService : IConfigurationService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<ConfigurationService> _logger;
        private readonly string _appConfigurationUrl;

        public ConfigurationService(IAppSettings appSettings,
                                    IMiddleTierHttpClient middleTierHttpClient,
                                    ILogger<ConfigurationService> logger)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _appConfigurationUrl = appSettings.GetSetting("App.Configuration.Url");
        }


        public async Task<T> GetAsync<T>(FindModel findModel) where T : class
        {
            try
            {
                var findConfigurationUrl = _appConfigurationUrl
                   .AppendPathSegment("find")
                   .SetQueryParams(findModel);

                var configurationFindResponse = await _middleTierHttpClient.GetAsync<T>(findConfigurationUrl);
                return configurationFindResponse;
            }
            catch (RemoteServerHttpException ex)
            {
                if (ex.Code == System.Net.HttpStatusCode.NotFound)
                {
                    return null;
                }
                _logger.LogError(ex, "Exception at searching Configurations  : " + nameof(GetAsync));
                throw;
            }
        }
    }
}
