using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDeals
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string[] ProductIds { get; set; }
            public string VendorBidNumber { get; set; }
            public string VendorName { get; set; }
            public string EndUserName { get; set; }
            public DateTime? ValidFrom { get; set; }
            public DateTime? ValidTo { get; set; }
            public DateTime? UpdatedFrom { get; set; }
            public DateTime? UpdatedTo { get; set; }
            public bool Details { get; set; }
            public SortField? Sort { get; set; }
            public SortDirection SortDirection { get; set; }
            public bool TotalCount { get; set; } = true;
            public string[] MfrPartNumbers { get; set; }
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 25;
            public PricingCondition? Pricing { get; set; }
            public enum SortField
            {
                VendorBidNumber,
                VendorName,
                EndUserName,
                ExpirationDate
            }
            public Request()
            {
            }
        }

        public class Response
        {
            public int TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int? PageNumber { get; set; }
            public int? PageSize { get; set; }
            public IList<Deal> response { get; set; }
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            public Handler(
                IMapper mapper,
                ILoggerFactory loggerFactory,
                IConfigService configService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _mapper = mapper;
                _configService = configService;
            }

            protected readonly IMapper _mapper;
            protected readonly IConfigService _configService;

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {

                var dealsDetails = await _configService.GetDeals(request).ConfigureAwait(false);
                var dealsResponse = _mapper.Map<Response>(dealsDetails);
                var getDealsResponse = new Response
                {
                    TotalItems = dealsResponse.TotalItems,
                    PageNumber = request.Page,
                    PageSize = request.PageSize,
                    PageCount = (dealsResponse.TotalItems + request.PageSize - 1) / request.PageSize,
                    response=dealsResponse.response,

            };
                return new ResponseBase<Response> { Content = getDealsResponse };
            }
        }

        public class Validator : AbstractValidator<GetDeals.Request>
        {
            public Validator()
            {
                RuleFor(x => x.Page)
                    .NotEmpty().GreaterThan(0).WithMessage("Page must be greater than 0.");
                RuleFor(x => x.PageSize)
                    .NotEmpty().GreaterThan(0).WithMessage("PageSize must be greater than 0.");
                RuleFor(x => x.SortDirection).IsInEnum();
                When(x => x.Pricing.HasValue, () =>
                {
                    RuleFor(x => x.Pricing).IsInEnum();
                });
            }
        }
    }
}