using AutoMapper;
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
        public class Request : IRequest<Response>
        {
            public string UserId { get; set; }
            public string ProductId { get; set; }

            public Request(string userId, string productId)
            {
                UserId = userId;
                ProductId = productId;
            }
        }

        public class Response
        {
            public QuoteDetails QuoteDetails { get; set; }
        }
        public class Handler : IRequestHandler<Request, Response>
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
            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var cartDetails = await _quoteService.GetCartDetailsInQuote(request);
                    var getcartResponse = _mapper.Map<Response>(cartDetails);
                    return getcartResponse;
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
