using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalFoundation.Core.Models.DTO.Common;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductDetails
{
    public class GetProductDetailsHandler
    {
        public class GetProductDetailsRequest : IRequest<GetProductDetailsResponse>
        {
            public List<string> Id { get; set; }
            public bool Details { get; set; }

            public GetProductDetailsRequest(List<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class GetProductDetailsResponse : Response<IEnumerable<ProductModel>>
        {
            public GetProductDetailsResponse()
            {
            }

            public GetProductDetailsResponse(IEnumerable<ProductModel> response)
            {
                ReturnObject = response;
            }
        }

        public class Handler : IRequestHandler<GetProductDetailsRequest, GetProductDetailsResponse>
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

            public async Task<GetProductDetailsResponse> Handle(GetProductDetailsRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _customerRepositoryServices.GetProductdetials(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductDetailsResponse>(productDetails);
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
