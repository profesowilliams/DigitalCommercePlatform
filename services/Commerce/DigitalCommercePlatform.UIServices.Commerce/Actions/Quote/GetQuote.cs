//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    public sealed class GetQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public bool Details { get; set; }

            public Request(IReadOnlyCollection<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public QuoteDetails Details { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _commerceRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly IQuoteItemChildrenService _quoteItemChildrenService;
            public Handler(ICommerceService commerceRepositoryServices, IMapper mapper,
                ILogger<Handler> logger,
                IQuoteItemChildrenService quoteItemChildrenService
                )
            {
                _commerceRepositoryServices = commerceRepositoryServices;
                _mapper = mapper;
                _logger = logger;
                _quoteItemChildrenService = quoteItemChildrenService ?? throw new ArgumentNullException(nameof(quoteItemChildrenService));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var getQuoteResponse = new Response();
                var productDetails = await _commerceRepositoryServices.GetQuote(request).ConfigureAwait(false);
                if (productDetails != null)
                {
                    getQuoteResponse.Details = _mapper.Map<QuoteDetails>(productDetails);
                    if (getQuoteResponse.Details != null)
                    {
                        getQuoteResponse.Details.Items = await _commerceRepositoryServices.PopulateLinesFor(getQuoteResponse.Details.Items, string.Empty);
                        getQuoteResponse.Details.Items = _quoteItemChildrenService.GetQuoteLinesWithChildren(new QuotePreviewModel { QuoteDetails = new QuotePreview { Items = getQuoteResponse.Details.Items } });
                    }
                }
                else
                {
                    getQuoteResponse.Details = null;
                }
                return new ResponseBase<Response> { Content = getQuoteResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
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
