//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ISearchService
    {
        public Task<List<TypeAheadModel>> GetTypeAhead(TypeAhead.Request request);

        public Task<AppSearchResponseDto> GetProductData(AppSearchRequestModel request);
    }
}
