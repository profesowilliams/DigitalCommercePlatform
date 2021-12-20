//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public sealed class UpdateQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public UpdateModel QuoteToUpdate { get; set; }

            public Request(UpdateModel quoteToUpdate)
            {
                QuoteToUpdate = quoteToUpdate;
            }
        }

        public class Response
        {
            public QuoteModel QuoteModel { get; }

            public Response(QuoteModel quoteModel)
            {
                QuoteModel = quoteModel;
            }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _quoteService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService quoteService, IMapper mapper, ILogger<Handler> logger)
            {
                _quoteService = quoteService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var response = await _quoteService.UpdateQuote(request);
                    return new ResponseBase<Response> { Content = response };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(UpdateQuote)}");
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(r => r.QuoteToUpdate).Cascade(CascadeMode.Stop).NotNull()
                    .ChildRules(request =>
                    {
                        request.RuleFor(c => c.QuoteId).NotEmpty();
                    });
            }
        }
    }
}
