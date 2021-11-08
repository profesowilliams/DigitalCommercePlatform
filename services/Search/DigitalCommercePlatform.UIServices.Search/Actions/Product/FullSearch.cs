//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Enums;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
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

            public Request(bool isAnonymous, FullSearchRequestModel fullSearchRequestModel)
            {
                IsAnonymous = isAnonymous;
                FullSearchRequestModel = fullSearchRequestModel;
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

            public Handler(ISearchService searchService, ILogger<Handler> logger, IMapper mapper)
            {
                _searchService = searchService;
                _logger = logger;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var appRequest = _mapper.Map<SearchRequestDto>(request.FullSearchRequestModel);
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

                return new Response(await _searchService.GetFullSearchProductData(appRequest, request.IsAnonymous));
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.FullSearchRequestModel).NotNull();
                RuleFor(c => c.FullSearchRequestModel.SearchString).NotNull();
            }
        }
    }
}