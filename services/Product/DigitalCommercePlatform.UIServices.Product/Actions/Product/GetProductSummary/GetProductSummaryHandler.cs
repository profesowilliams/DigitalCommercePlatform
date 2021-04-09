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
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalCommercePlatform.UIServices.Product.Models.Summary;

namespace DigitalCommercePlatform.UIServices.Product.Actions.Product.GetProductSummary
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

            private readonly IProductService _productRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            public Handler(IProductService productRepositoryServices, IMapper mapper, ILogger<Handler> logger)
            {
                _productRepositoryServices = productRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetProductSummaryResponse> Handle(GetProductSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.GetProductSummary(request).ConfigureAwait(false);
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
        public class Validator : AbstractValidator<GetProductSummaryRequest>
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
