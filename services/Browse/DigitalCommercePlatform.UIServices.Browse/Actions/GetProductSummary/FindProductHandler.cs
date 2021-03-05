using System;
using MediatR;
using AutoMapper;
using System.Threading;
using FluentValidation;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary
{
    [ExcludeFromCodeCoverage]
    public class FindProductHandler
    {
        public class GetProductRequest : IRequest<GetProductResponse>
        {
            public FindProductModel Query { get; set; }
            public bool Details { get; set; }

            public GetProductRequest(FindProductModel query,bool details)
            {
                Query = query;
                Details = details;
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
            public Handler(IBrowseService productRepositoryServices, IMapper mapper,ILogger<Handler> logger)
            {
                _productRepositoryServices = productRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetProductResponse> Handle(GetProductRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.FindProductdetials(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductResponse>(productDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw ;
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
