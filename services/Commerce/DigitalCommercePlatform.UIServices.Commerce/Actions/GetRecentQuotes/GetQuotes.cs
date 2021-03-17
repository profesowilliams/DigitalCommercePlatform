using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes
{
    public class GetQuotes
    {
        public class Request:IRequest<Response>
        {
            public FindModel Query { get; set; }

            public Request(FindModel query)
            {
                Query = query;
            }
        }
        public class Response
        {
            public IEnumerable<RecentQuotesModel> RecentQuotes { get; set; }
            public int? TotalItems { get; set; }
            public int PageNumber { get; set; }
            public int PageSize { get; set; }
            public bool IsError { get; internal set; }
            public string ErrorCode { get; internal set; }
            public string ErrorDescription { get; set; }

        }
        public class Handler : IRequestHandler<Request,Response>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService commerceQueryService, IMapper mapper, ILogger<Handler> logger)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var quoteDetails = await _commerceQueryService.FindQuoteDetails(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<Response>(quoteDetails);
                    return getProductResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(Handler));
                    throw;
                }
            }
        }
    }
}
