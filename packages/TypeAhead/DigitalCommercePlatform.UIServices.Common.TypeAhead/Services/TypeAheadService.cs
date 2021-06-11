using DigitalCommercePlatform.UIServices.Common.TypeAhead.Contracts;
using DigitalCommercePlatform.UIServices.Common.TypeAhead.Models;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.TypeAhead.Services
{
    class TypeAheadService : ITypeAheadService
    {
        private readonly string _typeSearchUrl;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;

        public TypeAheadService(IOptions<AppSettings> options, IMiddleTierHttpClient middleTierHttpClient)
        {
            if (options == null) { throw new ArgumentNullException(nameof(options)); }
            _typeSearchUrl = options.Value?.TryGetSetting("Core.Search.Url") ?? throw new InvalidOperationException("Core.Search.Url is missing from AppSettings");

            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
        }

        public async Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(string SearchTerm, int? MaxResults)
        {
            var typeAheadUrl = _typeSearchUrl.AppendPathSegment("/GetTypeAheadTerms").BuildQuery("searchTerm=" + SearchTerm + "&maxResults=" + MaxResults);
            var getTypeAheadResponse = await _middleTierHttpClient.GetAsync<IEnumerable<TypeAheadSuggestion>>(typeAheadUrl);
            return getTypeAheadResponse;
        }
    }
}
