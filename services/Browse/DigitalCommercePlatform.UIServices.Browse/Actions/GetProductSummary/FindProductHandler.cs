using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary
{
    public static class FindProductHandler
    {
        public class GetProductRequest : IRequest<GetProductResponse>
        {
            public FindProductModel Query { get; set; }

            public GetProductRequest(FindProductModel query)
            {
                Query = query;
            }
        }

        public class GetProductResponse
        {
            public IEnumerable<ProductModel> ReturnObject { get; set; }
        }

        public class Handler : IRequestHandler<GetProductRequest, GetProductResponse>
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

            public async Task<GetProductResponse> Handle(GetProductRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.FindProductDetails(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductResponse>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<GetProductRequest>
        {
            public Validator()
            {
                RuleFor(x => x.Query).NotEmpty();
            }
        }
    }
}