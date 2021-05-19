using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Services;
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
    [ExcludeFromCodeCoverage]
    public class GetQuotesForGrid
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string CreatedBy { get; set; }
            public string QuoteIdFilter { get; set; }
            public string ConfigIdFilter { get; set; }
            public DateTime? CreatedFrom { get; set; }
            public DateTime? CreatedTo { get; set; }
            public string SortBy { get; set; }
            public string SortDirection { get; set; }
            public int? PageSize { get; set; } = 25;
            public int? PageNumber { get; set; } = 1;
            public bool? WithPaginationInfo { get; set; } = true;

            public Request()
            {
            }
        }
        public class Response
        {
            public long? TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int? PageNumber { get; set; }
            public int? PageSize { get; set; }
            public IEnumerable<QuotesForGridModel> Items { get; set; }

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
                    var query = new FindModel()
                    {
                        CreatedBy = request.CreatedBy,
                        SortBy = request.SortBy,
                        SortAscending = string.IsNullOrWhiteSpace(request.SortDirection) ? false : request.SortDirection.ToLower().Equals("asc") ? true : false,
                        Page = request.PageNumber,
                        PageSize = request.PageSize,
                        WithPaginationInfo = request.WithPaginationInfo,
                        // Filters
                        Id = request.QuoteIdFilter,
                        // ??? = request.ConfigIdFilter, // JH: I'm not able to find which field allows me to filter by ConfigId in App-Quote
                        CreatedTo = request.CreatedFrom,
                        ExpiresTo = request.CreatedTo,
                    };
                    var quoteDetails = await _commerceQueryService.FindQuotes(query).ConfigureAwait(false);
                    var getProductResponse = _mapper.Map<Response>(quoteDetails);
                    getProductResponse = new Response
                    {
                        Items = getProductResponse.Items,
                        TotalItems = quoteDetails?.Count,
                        PageNumber = request.PageNumber,
                        PageSize = request.PageSize,
                        PageCount = (quoteDetails?.Count + request.PageSize - 1) / request.PageSize

                    };
                    return new ResponseBase<Response> { Content = getProductResponse };
            }
        }
        public class GetQuotesValidator : AbstractValidator<Request>
        {
            public GetQuotesValidator(ISortingService sortingService)
            {
                RuleFor(i => i.PageSize).GreaterThan(0).WithMessage("Page Size must be greater than 0.");
                RuleFor(i => i.PageNumber).GreaterThanOrEqualTo(0).WithMessage("PageNumber must be greater than or equal to 0.");
            }
        }
    }
}
