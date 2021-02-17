using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalCommercePlatform.UIServices.Product.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product.FindProduct
{
    public class FindProductHandler
    {
        public class GetProductRequest : IRequest<GetProductResponse>
        {
            public FindProductModel Query { get; set; }
            public bool WithPaginationInfo { get; set; }
            public int Page { get; set; }
            public int PageSize { get; set; }
            public bool Details { get; set; }

            public GetProductRequest(FindProductModel query, bool withPaginationInfo,int page,int pageSize,bool details)
            {
                Query = query;
                WithPaginationInfo = withPaginationInfo;
                Page = page;
                PageSize = pageSize;
                Details = details;
            }
        }
        public class GetProductResponse
        {
            public IEnumerable<ProductModel> ReturnObject { get; set; }
        }

        public class Handler : IRequestHandler<GetProductRequest, GetProductResponse>
        {
            private readonly IProductService _customerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IProductService customerRepositoryServices,
                IMapper mapper,
                ILogger<Handler> logger)
            {
                _customerRepositoryServices = customerRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            [System.Diagnostics.CodeAnalysis.SuppressMessage("Usage", "CA2200:Rethrow to preserve stack details", Justification = "<Pending>")]
            public async Task<GetProductResponse> Handle(GetProductRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _customerRepositoryServices.FindProductdetials(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductResponse>(productDetails);
                    return getProductResponse;

                    //var customerDetails = await _customerRepositoryServices.FindProductdet();
                    //var getCustomerResponse = _mapper.Map<IEnumerable<GetProductResponse>>(customerDetails)?.FirstOrDefault();
                    //return getCustomerResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw ex;
                }

            }
        }
    }
}
