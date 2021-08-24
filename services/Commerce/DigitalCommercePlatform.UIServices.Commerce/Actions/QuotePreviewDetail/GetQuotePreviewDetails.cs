//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail
{
    [ExcludeFromCodeCoverage]
    public sealed class GetQuotePreviewDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public bool Details { get; set; } = true;
            public bool IsEstimateId { get; set; }
            public string Vendor { get; set; }

            public Request(string id, bool isEstimateId, string vendor)
            {
                Id = id;
                IsEstimateId = isEstimateId;
                Vendor = vendor;
            }
        }

        public class Response
        {
            public QuotePreviewModel QuotePreview { get; private set; }

            public Response(QuotePreviewModel quotePreview)
            {
                QuotePreview = quotePreview;
            }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _quoteService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly IQuoteItemChildrenService _quoteItemChildrenService;

            public Handler(ICommerceService quoteService, IMapper mapper, ILogger<Handler> logger, IQuoteItemChildrenService quoteItemChildrenService)
            {
                _quoteService = quoteService ?? throw new ArgumentNullException(nameof(quoteService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _quoteItemChildrenService = quoteItemChildrenService ?? throw new ArgumentNullException(nameof(quoteItemChildrenService));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var quoteDetailsModel = await _quoteService.QuotePreview(request);
                if (quoteDetailsModel?.QuoteDetails != null)
                {
                    quoteDetailsModel.QuoteDetails.Items = _quoteItemChildrenService.GetQuoteLinesWithChildren(quoteDetailsModel);
                }
                // No need to map, returning Model var getcartResponse = _mapper.Map<Response>(quoteDetails);
                var response = new Response(quoteDetailsModel);
                return new ResponseBase<Response> { Content = response };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotEmpty();
            }
        }
    }
}
