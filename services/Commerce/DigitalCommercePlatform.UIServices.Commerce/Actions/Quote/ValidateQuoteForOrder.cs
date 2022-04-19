//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public sealed class ValidateQuoteForOrder
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public string CheckoutSystem { get; set; }
            public bool LatestRevision { get; set; } = true;
            public Request(string id, bool latestRevision)
            {
                Id = id;
                LatestRevision = latestRevision;
            }
        }
        [ExcludeFromCodeCoverage]
        public class Response
        {
            public bool CanCheckout { get; set; }
            public List<string> LineNumbers { get; set; }
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _commerceRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService commerceRepositoryServices, IMapper mapper,
                ILogger<Handler> logger
                )
            {
                _commerceRepositoryServices = commerceRepositoryServices;
                _mapper = mapper;
                _logger = logger;

            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                Response result = await _commerceRepositoryServices.IsValidDealForQuote(request).ConfigureAwait(false);
                return new ResponseBase<Response> { Content = new Response { CanCheckout = result.CanCheckout, LineNumbers = result.LineNumbers } };
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