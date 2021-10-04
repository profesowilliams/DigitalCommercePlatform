//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Settings;
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
            private const string _categories = "CATEGORIES";

            public Handler(ISearchService searchService, ILogger<Handler> logger, IMapper mapper, ISiteSettings siteSettings)
            {
                _searchService = searchService;
                _logger = logger;
                _mapper = mapper;
                _catalog = siteSettings.TryGetSetting("Catalog")?.ToString();
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var appRequest = new AppSearchRequestModel();
                if (!string.IsNullOrEmpty(request.Keyword))
                {
                    appRequest.SearchString = request.Keyword;
                }
                if (!string.IsNullOrEmpty(request.CategoryId))
                {
                    appRequest.RefinementGroups = new List<Models.FullSearch.App.Internal.RefinementGroupRequestModel>() {
                        new Models.FullSearch.App.Internal.RefinementGroupRequestModel()
                        {
                            Group = _categories,
                            Refinements = new List<Models.FullSearch.App.Internal.RefinementRequestModel>()
                            {
                                new Models.FullSearch.App.Internal.RefinementRequestModel()
                                {
                                    Id = _catalog,
                                    Value = request.CategoryId
                                }
                            }
                        }
                    };
                }

                var response = await _searchService.GetFullSearchProductData(appRequest, request.IsAnonymous);
                if (!request.IsAnonymous && response.Products != null &&response.Products.Count == 1)
                {
                    response.Products.FirstOrDefault().IsExactMatch = true;
                }
                return new Response(response);
            }
        }
    }
}
