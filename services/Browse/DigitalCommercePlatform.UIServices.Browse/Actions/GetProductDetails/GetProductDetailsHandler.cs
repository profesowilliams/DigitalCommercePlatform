using System;
using MediatR;
using AutoMapper;
using System.Threading;
using FluentValidation;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Core.Models.DTO.Common;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails
{
    [ExcludeFromCodeCoverage]
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
            private readonly IBrowseService _productRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IBrowseService productRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _productRepositoryServices = productRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetProductDetailsResponse> Handle(GetProductDetailsRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.GetProductdetials(request).ConfigureAwait(false);
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
        public class Validator : AbstractValidator<GetProductDetailsRequest>
        {
            public Validator()
            {
                SetRules();
            }

            private void SetRules()
            {
                RuleFor(r => r.Id).NotEmpty();
            }
        }
    }
}
