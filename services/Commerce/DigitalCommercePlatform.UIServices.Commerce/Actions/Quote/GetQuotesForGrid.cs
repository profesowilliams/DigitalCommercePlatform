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

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public class GetQuotesForGrid
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CreatedBy { get; set; }
            public string QuoteIdFilter { get; set; }
            public string ConfigIdFilter { get; set; }
            public DateTime? QuoteCreationDateFilter { get; set; }
            public DateTime? QuoteExpirationDateFilter { get; set; }
            public string SortBy { get; set; }
            public bool? SortAscending { get; set; }
            public int? PageSize { get; set; }
            public int? PageNumber { get; set; }
            public bool? WithPaginationInfo { get; set; }

            public Request()
            {
            }
        }
        public class Response
        {
            public IEnumerable<QuotesForGridModel> Quotes { get; set; }
            public long? Count { get; set; }
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
                    var query = new FindModel()
                    {
                        CreatedBy = request.CreatedBy,
                        SortBy = request.SortBy,
                        SortAscending = request.SortAscending,
                        Page = request.PageNumber,
                        PageSize = request.PageSize,
                        WithPaginationInfo = request.WithPaginationInfo,
                        // Filters
                        Id = request.QuoteIdFilter,
                        // ??? = request.ConfigIdFilter, // JH: I'm not able to find which field allows me to filter by ConfigId in App-Quote
                        CreatedTo = request.QuoteCreationDateFilter,
                        ExpiresTo = request.QuoteExpirationDateFilter,
                    };
                    if (request.SortAscending != null) { query.SortAscending = (bool)request.SortAscending; }

                    var quoteDetails = await _commerceQueryService.FindQuotes(query).ConfigureAwait(false);
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
