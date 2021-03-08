using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Core.Models.DTO.Common;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary
{
    public static class FindSummaryHandler
    {
        public class FindSummaryRequest : IRequest<FindSummaryResponse>
        {
            public FindProductModel Query { get; set; }
            public bool Details { get; set; }

            public FindSummaryRequest(FindProductModel query, bool details)
            {
                Query = query;
                Details = details;
            }
        }

        public class FindSummaryResponse : PaginatedResponse<IEnumerable<SummaryModel>>
        {
            public FindSummaryResponse()
            {
            }

            public FindSummaryResponse(IEnumerable<SummaryModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<FindSummaryRequest, FindSummaryResponse>
        {
            private readonly IBrowseService _productRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService productRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _productRepositoryServices = productRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<FindSummaryResponse> Handle(FindSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.FindSummaryDetails(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<FindSummaryResponse>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<FindSummaryRequest>
        {
            public Validator()
            {
                RuleFor(x => x.Query).NotEmpty();
            }
        }
    }
}