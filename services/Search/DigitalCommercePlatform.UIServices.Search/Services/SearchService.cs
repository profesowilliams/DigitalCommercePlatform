//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public class SearchService : ISearchService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly string _appSearchUrl;
        private readonly ILogger<SearchService> _logger;
        private readonly IUIContext _context;

        public SearchService(IMiddleTierHttpClient middleTierHttpClient,
    ILogger<SearchService> logger, IAppSettings appSettings, IUIContext context)
        {
            _logger = logger;
            _context = context;
            _middleTierHttpClient = middleTierHttpClient;
            _appSearchUrl = appSettings.GetSetting("App.Search.Url");
        }

        public async Task<List<TypeAheadModel>> GetTypeAhead(TypeAhead.Request request)
        {
            var typeAheadUrl = _appSearchUrl.AppendPathSegment("/TypeAhead").BuildQuery(request);
            try
            {
                var getTypeAheadResponse = await _middleTierHttpClient.GetAsync<List<TypeAheadModel>>(typeAheadUrl);
                return getTypeAheadResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting GetTypeAhead : " + nameof(SearchService));
                throw ex;
            }
        }
    }
}
