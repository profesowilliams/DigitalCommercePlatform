//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Product
{
    public sealed class KeywordSearch
    {
        public class Request : IRequest<Response>
        {
            public bool IsAnonymous { get; set; }
            public string Keyword { get; set; }
            public string CategoryId { get; set; }
            public string Catalog { get; set; }

            public Request(bool isAnonymous, string keyword, string categoryId)
            {
                IsAnonymous = isAnonymous;
                Keyword = keyword;
                CategoryId = categoryId;
            }
        }

        public class Response
        {
            public FullSearchResponseModel Results { get; set; }

            public Response(FullSearchResponseModel results)
            {
                Results = results;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ISearchService _searchService;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;
            private readonly string _catalog;
            private readonly List<RefinementGroupRequestDto> _defaultIndicators;
            private const string _categories = "CATEGORIES";

            public Handler(ISearchService searchService, ILogger<Handler> logger, IMapper mapper, ISiteSettings siteSettings)
            {
                _searchService = searchService;
                _logger = logger;
                _mapper = mapper;
                _catalog = siteSettings.TryGetSetting("Catalog.All.DefaultCatalog")?.ToString();
                _defaultIndicators = JsonHelper.DeserializeObjectSafely<List<RefinementGroupRequestDto>>(
                    value: siteSettings.TryGetSetting("Search.UI.DefaultIndicators")?.ToString(),
                    settings: JsonSerializerSettingsHelper.GetJsonSerializerSettings(),
                    defaultValue: new List<RefinementGroupRequestDto>() { 
                        new RefinementGroupRequestDto(){ 
                            Group = "AvailabilityType",
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = "DropShip", ValueId = "Y" },
                                new RefinementRequestDto(){ Id = "Warehouse", ValueId = "Y" },
                                new RefinementRequestDto(){ Id = "Virtual", ValueId = "Y" }
                            }
                        },
                         new RefinementGroupRequestDto(){
                            Group = "ProductStatus",
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = "DisplayStatus", ValueId = "Allocated" },
                                new RefinementRequestDto(){ Id = "DisplayStatus", ValueId = "PhasedOut" },
                                new RefinementRequestDto(){ Id = "DisplayStatus", ValueId = "Active" }
                            }
                        },
                         new RefinementGroupRequestDto(){
                            Group = "InStock",
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = "InStock", ValueId = "Y" }
                            }
                        }
                    });
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var appRequest = new SearchRequestDto();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    appRequest.SearchString = request.Keyword;
                }
                if (!string.IsNullOrEmpty(request.CategoryId))
                {
                    appRequest.RefinementGroups = new List<RefinementGroupRequestDto>() {
                        new RefinementGroupRequestDto()
                        {
                            Group = _categories,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto()
                                {
                                    Id = _catalog,
                                    ValueId = request.CategoryId
                                }
                            }
                        }
                    };
                }
                appRequest.RefinementGroups ??= new List<RefinementGroupRequestDto>();
                appRequest.RefinementGroups.AddRange(_defaultIndicators);
                appRequest.GetDetails = new Dictionary<Enums.Details, bool> { { Enums.Details.TopRefinementsAndResult, true }, { Enums.Details.Price, true }, { Enums.Details.Authorizations, true } };

                var response = await _searchService.GetFullSearchProductData(appRequest, request.IsAnonymous);
                if (!request.IsAnonymous && response.Products != null && response.Products.Count == 1)
                {
                    response.Products.FirstOrDefault().IsExactMatch = true;
                }
                return new Response(response);
            }
        }
    }
}