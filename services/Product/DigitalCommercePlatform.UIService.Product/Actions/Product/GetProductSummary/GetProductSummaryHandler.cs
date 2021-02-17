using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Core.Models.DTO.Common;
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalCommercePlatform.UIService.Product.Models.Summary;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductSummary
{
    [ExcludeFromCodeCoverage]
    public class GetProductSummaryHandler
    {
        public class GetProductSummaryRequest : IRequest<GetProductSummaryResponse>
        {
            public List<string> Id { get; set; }
            public bool Details { get; set; }

            public GetProductSummaryRequest(List<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class GetProductSummaryResponse : Response<IEnumerable<SummaryModel>>
        {
            public GetProductSummaryResponse()
            {
            }

            public GetProductSummaryResponse(IEnumerable<SummaryModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<GetProductSummaryRequest, GetProductSummaryResponse>
        {

            private readonly IProductService _customerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IProductService customerRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _customerRepositoryServices = customerRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetProductSummaryResponse> Handle(GetProductSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _customerRepositoryServices.GetProductSummary(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductSummaryResponse>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw ;
                }

            }
        }
    }
}
