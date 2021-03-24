using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails
{
    [ExcludeFromCodeCoverage]
    public static class GetProductSummaryHandler
    {
        public class GetProductSummaryRequest : IRequest<ResponseBase<GetProductSummaryResponse>>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public bool Details { get; set; }

            public GetProductSummaryRequest(IReadOnlyCollection<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class GetProductSummaryResponse 
        {
            public SummaryModel SummaryModel { get; set; }
        }

        public class Handler : IRequestHandler<GetProductSummaryRequest, ResponseBase<GetProductSummaryResponse>>
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

            public async Task<ResponseBase<GetProductSummaryResponse>> Handle(GetProductSummaryRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var productDetails = await _productRepositoryServices.GetProductSummary(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<GetProductSummaryResponse>(productDetails);
                    return new ResponseBase<GetProductSummaryResponse> { Content = getProductResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
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