using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute
{
    [ExcludeFromCodeCoverage]
    public class SavedCartQuoteDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public bool Details => true;

            public Request(string Id)
            {
                this.Id = Id;
            }
        }

        public class Response
        {
            public QuoteDetailModel QuoteDetails { get; private set; }
            
            public Response(QuoteDetailModel quoteDetails)
            {
                QuoteDetails = quoteDetails;
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
                    var quoteDetailsModel = await _quoteService.GetCartDetailsInQuote(request);
                    // No need to map, returning Model var getcartResponse = _mapper.Map<Response>(quoteDetails);
                    var response = new Response(quoteDetailsModel);
                    return new ResponseBase<Response> { Content = response };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(SavedCartQuoteDetails));
                    throw;
                }
            }
        }
    }

}
