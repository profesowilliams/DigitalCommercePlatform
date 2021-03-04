using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary
{
    public class GetProductSummaryHandler
    {
        public class GetProductSummaryRequest : IRequest<GetProductSummaryResponse>
        {
            public FindProductModel Query { get; set; }
            public bool Details { get; set; }
            public GetProductSummaryRequest(FindProductModel query,bool details)
            {
                Query = query;
                Details = details;
            }
        }
        public class GetProductSummaryResponse
        {
            public IEnumerable<ProductModel> ReturnObject { get; set; }
        }
        public class Handler : IRequestHandler<GetProductSummaryRequest, GetProductSummaryResponse>
        {
            private readonly IBrowseService _browseRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IBrowseService browseRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _browseRepositoryServices = browseRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<GetProductSummaryResponse> Handle(GetProductSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _browseRepositoryServices.GetProductSummarydetials(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductSummaryResponse>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }
    }
}
