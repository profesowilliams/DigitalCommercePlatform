//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDeals
    {
        public class Request : Paginated, IRequest<ResponseBase<Response>>
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
            public PricingCondition? Pricing { get; set; }

            public enum SortField
            {
                VendorBidNumber,
                VendorName,
                EndUserName,
                ExpirationDate
            }
            
        }

        public class Response : PaginatedResponse<Deal>
        {
            public Response(FindResponse<Deal> findResponse, IPaginated request)
                : base(findResponse, request)
            {
            }
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IMapper _mapper;
            protected readonly IConfigService _configService;

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

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {

                var findResponse = await _configService.GetDeals(request).ConfigureAwait(false);
                return new ResponseBase<Response> { Content = new Response(findResponse, request) };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.PageNumber)
                    .NotEmpty().GreaterThan(0).WithMessage("PageNumber must be greater than 0.");
                RuleFor(x => x.PageSize)
                    .NotEmpty().GreaterThan(0).WithMessage("PageSize must be greater than 0.");
                RuleFor(x => x.SortDirection).IsInEnum();
                When(x => x.Pricing.HasValue, () =>
                {
                    RuleFor(x => x.Pricing).IsInEnum();
                });
                When(x => x.Sort.HasValue, () =>
                {
                    RuleFor(x => x.Sort).IsInEnum();
                });
            }
        }
    }
}
