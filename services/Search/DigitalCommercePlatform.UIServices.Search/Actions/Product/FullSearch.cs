//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalCommercePlatform.UIServices.Search.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Product
{
    public sealed class FullSearch
    {
        public class Request : IRequest<Response>
        {
            public bool IsAnonymous { get; set; }
            public FullSearchRequestModel FullSearchRequestModel { get; set; }
            public SearchProfileId ProfileId { get; set; }
            public string Culture { get; set; }


            public Request(bool isAnonymous, FullSearchRequestModel fullSearchRequestModel, SearchProfileId profileId,string culture)
            {
                IsAnonymous = isAnonymous;
                FullSearchRequestModel = fullSearchRequestModel;
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

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ISearchService _searchService;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;
            private readonly ISortService _sortService;
            private readonly IItemsPerPageService _itemsPerPageService;
            private readonly IOrderLevelsService _orderLevelsService;

            public Handler(ISearchService searchService, ILogger<Handler> logger, IMapper mapper, ISortService sortService, IItemsPerPageService itemsPerPageService, IOrderLevelsService orderLevelsService)
            {
                _searchService = searchService;
                _logger = logger;
                _mapper = mapper;
                _sortService = sortService;
                _itemsPerPageService = itemsPerPageService;
                _orderLevelsService = orderLevelsService;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                if (request.FullSearchRequestModel.PageSize == 0)
                {
                    request.FullSearchRequestModel.PageSize = _itemsPerPageService.GetDefaultItemsPerPage();
                }

                var appRequest = _mapper.Map<SearchRequestDto>(request.FullSearchRequestModel);
                appRequest.SearchProfileId = request.ProfileId;
                appRequest.Culture = request.Culture;
                appRequest.GetDetails ??= new Dictionary<Details, bool>();
                if (!request.IsAnonymous)
                {
                    appRequest.GetDetails.Add(Details.Price, true);
                    appRequest.GetDetails.Add(Details.Authorizations, true);
                }

                if (request.FullSearchRequestModel.GetRefinements)
                {
                    appRequest.GetDetails.Add(Details.TopRefinementsAndResult, true);
                }
                else
                {
                    appRequest.GetDetails.Add(Details.SearchWithoutRefinements, true);
                }

                if (appRequest.Sort is null)
                {
                    appRequest.Sort = _sortService.GetDefaultSortDto(request.ProfileId);
                }

                if (request.IsAnonymous)
                {
                    appRequest.OrderLevel = null;
                }
                else if (appRequest.OrderLevel is null)
                {
                    appRequest.OrderLevel = _orderLevelsService.GetOrderLevel(request.ProfileId);
                }

                var response = await _searchService.GetFullSearchProductData(appRequest, request.IsAnonymous).ConfigureAwait(false);

                if (request.FullSearchRequestModel.GetRefinements)
                {
                    response.SortingOptions = _sortService.GetSortingOptionsBasedOnRequest(request.FullSearchRequestModel.Sort, request.ProfileId);
                    response.ItemsPerPageOptions = _itemsPerPageService.GetItemsPerPageOptionsBasedOnRequest(request.FullSearchRequestModel.PageSize);
                }

                if (!request.IsAnonymous)
                {
                    response.OrderLevels = _orderLevelsService.GetOrderLevelOptions(request.ProfileId, request.FullSearchRequestModel.OrderLevel);
                }

                return new Response(response);
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            private readonly ISortService _sortService;

            public Validator(ISortService sortService)
            {
                _sortService = sortService;

                RuleFor(c => c.FullSearchRequestModel).NotNull();
                RuleFor(c => c.FullSearchRequestModel.SearchString).NotEmpty().When(w => w.FullSearchRequestModel?.RefinementGroups?.Find(x => x.Group.ToUpperInvariant() == "CATEGORIES") == null).WithMessage("Please provide SearchString or RefinementGroup Categories or both");
                
                RuleFor(c => c).Must(CheckValidSortTypeRequest).WithName("FullSearchRequestModel.Sort.Type").WithMessage("Sort type is invalid.");
            }

            private bool CheckValidSortTypeRequest(Request request)
            {
                if (request?.FullSearchRequestModel?.Sort == null || request?.FullSearchRequestModel?.Sort?.Type == null) { return true; }
                var sortOptions = _sortService.GetSortingOptionsBasedOnRequest(request.FullSearchRequestModel.Sort,  request.ProfileId);
                var isValid = sortOptions.Any(x => x.Id.StartsWith(request?.FullSearchRequestModel?.Sort?.Type, StringComparison.InvariantCultureIgnoreCase));
                return isValid;
            }
        }
    }
}