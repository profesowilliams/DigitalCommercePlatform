//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public class RedirectService : IRedirectService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appSearchUrl;
        private readonly ILogger<RedirectService> _logger;

        public RedirectService(
            IMiddleTierHttpClient middleTierHttpClient,
            ILogger<RedirectService> logger,
            IAppSettings appSettings)
        {
            _logger = logger;
            _middleTierHttpClient = middleTierHttpClient;
            _appSearchUrl = appSettings.GetSetting("App.Search.Url");
        }

        public async Task<ContentDto> GetRedirects(string keyword)
        {
            var url = _appSearchUrl.AppendPathSegment("/Redirects").SetQueryParams(new
            {
                keyword = keyword
            });

            try
            {
                return await _middleTierHttpClient.GetAsync<ContentDto>(url).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                if (ex is RemoteServerHttpException)
                {
                    var remoteEx = ex as RemoteServerHttpException;
                    if (remoteEx.Code == System.Net.HttpStatusCode.NotFound)
                    {
                        return null;
                    }
                }
                _logger.LogError(ex, "Exception at getting content: " + nameof(ContentService));
                throw;
            }
        }
    }
}