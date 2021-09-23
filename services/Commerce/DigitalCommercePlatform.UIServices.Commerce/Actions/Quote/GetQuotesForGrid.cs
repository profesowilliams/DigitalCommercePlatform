//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
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
            public string VendorReference { get; set; }
            public DateTime? CreatedFrom { get; set; }
            public DateTime? CreatedTo { get; set; }
            public string SortBy { get; set; }
            public string SortDirection { get; set; }
            public int? PageSize { get; set; } = 25;
            public int? PageNumber { get; set; } = 1;
            public bool? WithPaginationInfo { get; set; } = true;
            public string Manufacturer { get; set; }
            public string EndUserName { get; set; }
            public bool Details { get; set; } = true;

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
            private readonly IAppSettings _appSettings;

            public Handler(ICommerceService commerceQueryService, IMapper mapper, ILogger<Handler> logger, IAppSettings appSettings)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
                _logger = logger;
                _appSettings = appSettings;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                DateTime? dateFrom = null;
                DateTime? dateTo = null;
                var createdFrom = request.CreatedFrom?.ToShortDateString();
                var createdTo = request.CreatedTo?.ToShortDateString();
                if (createdFrom != null) { dateFrom = DateTime.Parse(createdFrom, new CultureInfo("en-US", true)); };
                if (createdTo != null) { dateTo = DateTime.Parse(createdTo, new CultureInfo("en-US", true)); };
                request.EndUserName = string.IsNullOrWhiteSpace(request.EndUserName) ? null : request.EndUserName + "*";

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
                    VendorReference = request.VendorReference,
                    CreatedFrom = dateFrom,
                    Manufacturer = request.Manufacturer,
                    CreatedTo = dateTo,
                    EndUserName = request.EndUserName,
                    Details = request.Details
                };
                var quoteDetails = await _commerceQueryService.FindQuotes(query).ConfigureAwait(false);
                var getProductResponse = _mapper.Map<Response>(quoteDetails);

                getProductResponse = new Response
                {
                    Items = QuoteGridItems(getProductResponse),
                    TotalItems = quoteDetails?.Count,
                    PageNumber = request.PageNumber,
                    PageSize = request.PageSize,
                    PageCount = (quoteDetails?.Count + request.PageSize - 1) / request.PageSize
                };
                return new ResponseBase<Response> { Content = getProductResponse };
            }

            private List<QuotesForGridModel> QuoteGridItems(Response response)
            {
                string IsDummyData = _appSettings.GetSetting("Feature.UI.QuoteDeals.ReturnDummyRecords");
                var quotes = response?.Items?.ToList();

                if (quotes == null) { return new List<QuotesForGridModel>(); }
                var vendorValue = response.Items.Where(x => x.Deals == null).ToList();


                //if (IsDummyData == "true" && vendorValue.Count == 0)
                //{
                //    var secondQuote = quotes.ElementAtOrDefault(1);

                //    if (secondQuote != null)
                //    {
                //        secondQuote.Deals = new List<VendorReferenceModel>
                //        {
                //            new VendorReferenceModel { Value = "1", Type = "2323232"}
                //        };
                //    }

                //    var thirdQuote = quotes.ElementAtOrDefault(2);

                //    if (thirdQuote != null)
                //    {
                //        thirdQuote.Deals = new List<VendorReferenceModel>
                //        {
                //            new VendorReferenceModel {  Value = "1", Type = "7755444" },
                //            new VendorReferenceModel { Value = "1", Type = "9871234"}
                //        };
                //    }

                //}

                return quotes;
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
