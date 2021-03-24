using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes
{
    [ExcludeFromCodeCoverage]
    public class FindQuotesForGrid
    {
        public class Request:IRequest<ResponseBase<Response>>
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
        }
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
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

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var quoteDetails = await _commerceQueryService.FindQuoteDetails(request).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<Response>(quoteDetails);
                    return new ResponseBase<Response> { Content = getProductResponse };
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
