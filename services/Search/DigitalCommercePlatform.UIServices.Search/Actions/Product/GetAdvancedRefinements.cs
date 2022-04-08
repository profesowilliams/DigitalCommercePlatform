//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Product
{
    public sealed class GetAdvancedRefinements
    {
        public class Request : IRequest<Response>
        {
            public bool IsAnonymous { get; set; }
            public FullSearchRequestModel FullSearchRequestModel { get; set; }

            public Request(bool isAnonymous, FullSearchRequestModel fullSearchRequestModel)
            {
                IsAnonymous = isAnonymous;
                FullSearchRequestModel = fullSearchRequestModel;
            }
        }

        public class Response
        {
            public List<RefinementGroupResponseModel> Results { get; set; }

            public Response(List<RefinementGroupResponseModel> results)
            {
                Results = results;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ISearchService _searchService;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;

            public Handler(ISearchService searchService, ILogger<Handler> logger, IMapper mapper)
            {
                _searchService = searchService;
                _logger = logger;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var appRequest = _mapper.Map<SearchRequestDto>(request.FullSearchRequestModel);
                var detailsDict = new Dictionary<Details, bool>() { { Details.Refinements, true } };

                appRequest.GetDetails = detailsDict;

                var response = await _searchService.GetAdvancedRefinements(appRequest);
                PostProcessResponseBasedOnIsAnonymous(request, response);
                return new Response(response);
            }

            private static List<RefinementGroupResponseModel> PostProcessResponseBasedOnIsAnonymous(Request request, List<RefinementGroupResponseModel> refinementGroups)
            {
                if (!request.IsAnonymous || refinementGroups == null) { return refinementGroups; }
                var generalGroup = refinementGroups.FirstOrDefault(x => x.Group == RefinementConstants.GeneralGroupName);
                if (generalGroup != null)
                { 
                    generalGroup?.Refinements.RemoveAll(x => x.Id == RefinementConstants.Countries);
                }
                return refinementGroups;
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.FullSearchRequestModel).NotEmpty();
                When(x => x.FullSearchRequestModel != null, () =>
                {
                    RuleFor(c => c.FullSearchRequestModel.SearchString).NotEmpty();
                });
            }
        }
    }
}