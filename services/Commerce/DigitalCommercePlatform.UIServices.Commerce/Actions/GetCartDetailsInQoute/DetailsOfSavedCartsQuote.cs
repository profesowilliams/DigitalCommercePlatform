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
    public class DetailsOfSavedCartsQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CartId { get; set; }

            public Request(string cartId)
            {
                CartId = cartId;
            }
        }

        public class Response
        {
            public QuoteDetails QuoteDetails { get; set; }
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
                    var cartDetails = await _quoteService.GetCartDetailsInQuote(request);
                    var getcartResponse = _mapper.Map<Response>(cartDetails);
                    return new ResponseBase<Response> { Content = getcartResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Cart  : " + nameof(DetailsOfSavedCartsQuote));
                    throw;
                }
            }
        }
    }

}
