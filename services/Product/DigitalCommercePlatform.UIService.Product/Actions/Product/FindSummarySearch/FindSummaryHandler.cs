using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalFoundation.Core.Models.DTO.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product.FindSummarySearch
{
    public class FindSummaryHandler
    {
        public class FindSummaryRequest : IRequest<FindSummaryResponse>
        {
            public FindProductModel Query { get; set; }
            public bool WithPaginationInfo { get; set; }
            public int Page { get; set; }
            public int PageSize { get; set; }
            public bool Details { get; set; }

            public FindSummaryRequest(FindProductModel query, bool withPaginationInfo, int page, int pageSize,bool details)
            {
                Query = query;
                WithPaginationInfo = withPaginationInfo;
                Page = page;
                PageSize = pageSize;
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
            private readonly IProductService _customerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IProductService customerRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _customerRepositoryServices = customerRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<FindSummaryResponse> Handle(FindSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _customerRepositoryServices.FindSummarydetials(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<FindSummaryResponse>(productDetails);
                    return getProductResponse;

                    //var customerDetails = await _customerRepositoryServices.FindProductdet();
                    //var getCustomerResponse = _mapper.Map<IEnumerable<GetProductResponse>>(customerDetails)?.FirstOrDefault();
                    //return getCustomerResponse;
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
