//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Providers.Settings;
using FluentValidation;
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
            public SearchProfileId ProfileId { get; set; }
            public string Culture { get; set; }

            public Request(bool isAnonymous, string keyword, string categoryId, SearchProfileId profileId,string culture)
            {
                IsAnonymous = isAnonymous;
                Keyword = keyword;
                CategoryId = categoryId;
                ProfileId = profileId;
                Culture = culture;
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

        public record KeywordSearchHandlerArgs(ISearchService SearchService, ILogger<Handler> Logger, IMapper Mapper, ISiteSettings SiteSettings, 
            ISortService SortService, IItemsPerPageService ItemsPerPageService, IDefaultIndicatorsService DefaultIndicatorsService, IMarketService MarketService,IOrderLevelsService OrderLevelsService);

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ISearchService _searchService;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;
            private readonly ISortService _sortService;
            private readonly IItemsPerPageService _itemsPerPageService;
            private readonly string _catalog;
            private readonly IDefaultIndicatorsService _defaultIndicatorsService;
            private readonly IMarketService _marketService;
            private readonly IOrderLevelsService _orderLevelsService;
            private const string _categories = "CATEGORIES";

            public Handler(KeywordSearchHandlerArgs args)
            {
                _searchService = args.SearchService;
                _logger = args.Logger;
                _mapper = args.Mapper;
                _sortService = args.SortService;
                _itemsPerPageService = args.ItemsPerPageService;
                _catalog = args.SiteSettings.TryGetSetting("Catalog.All.DefaultCatalog")?.ToString();
                _defaultIndicatorsService = args.DefaultIndicatorsService;
                _marketService = args.MarketService;
                _orderLevelsService = args.OrderLevelsService;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var appRequest = new SearchRequestDto();
                appRequest.SearchProfileId = request.ProfileId;
                appRequest.Culture = request.Culture;

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
                appRequest.RefinementGroups.AddRange(_defaultIndicatorsService.GetDefaultIndicators(request.ProfileId) ?? new());
                appRequest.GetDetails = new Dictionary<Enums.Details, bool> { { Enums.Details.TopRefinementsAndResult, true }, { Enums.Details.Price, true }, { Enums.Details.Authorizations, true } };
                appRequest.Sort = _sortService.GetDefaultSortDto(request.ProfileId);
                appRequest.PageSize = _itemsPerPageService.GetDefaultItemsPerPage();
                appRequest.Territories = _marketService.GetMarkets(request.ProfileId);
                if (!request.IsAnonymous)
                {
                    appRequest.OrderLevel = _orderLevelsService.GetOrderLevel(request.ProfileId);
                }
                var response = await _searchService.GetFullSearchProductData(appRequest, request.IsAnonymous);
                if (!request.IsAnonymous && response.Products != null && response.Products.Count == 1)
                {
                    response.Products.FirstOrDefault().IsExactMatch = true;
                }

                response.SortingOptions = _sortService.GetDefaultSortingOptions(request.ProfileId);
                response.ItemsPerPageOptions = _itemsPerPageService.GetDefaultItemsPerPageOptions();

                if (!request.IsAnonymous)
                {
                    response.OrderLevels = _orderLevelsService.GetOrderLevelOptions(request.ProfileId);
                }


                return new Response(response);
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Keyword).NotEmpty().When(w => string.IsNullOrEmpty(w.CategoryId)).WithMessage("Please provide keyword or categoryId or both");
            }
        }
    }
}