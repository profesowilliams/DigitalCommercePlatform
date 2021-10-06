//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public class ContentService : IContentService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appSearchUrl;
        private readonly ILogger<ContentService> _logger;
        private readonly IUIContext _context;

        public ContentService(IMiddleTierHttpClient middleTierHttpClient,
    ILogger<ContentService> logger, IAppSettings appSettings, IUIContext context)
        {
            _logger = logger;
            _context = context;
            _middleTierHttpClient = middleTierHttpClient;
            _appSearchUrl = appSettings.GetSetting("App.Search.Url");
        }

        public async Task<ContentSearchResponseDto> GetContentData(FullSearchRequestDto request)
        {
            var url = _appSearchUrl.AppendPathSegment("/Content").SetQueryParams(new
            {
                searchstring = request.SearchString,
                refinements = string.Join(",", request.Refinements.Select(r => string.Format("{0}:{1}", r.Id, r.Value)).ToArray()),
                page = request.Page,
                pagesize = request.PageSize
            }); ;

            try
            {
                return await _middleTierHttpClient.GetAsync<ContentSearchResponseDto>(url).ConfigureAwait(false);
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
                _logger.LogError(ex, "Exception at getting GetContentData : " + nameof(ContentService));
                throw;
            }
        }
    }
}
