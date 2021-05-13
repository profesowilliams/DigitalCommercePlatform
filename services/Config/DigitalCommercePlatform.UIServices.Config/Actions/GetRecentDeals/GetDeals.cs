using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDeals
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public FindModel Criteria { get; set; }
        }
        public class Response
        {
            public long? TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int? PageNumber { get; set; }
            public int? PageSize { get; set; }
            public List<Deal> Items { get; internal set; }
        }

        public class GetDealsHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IConfigService _configService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetDealsHandler> _logger;
            public GetDealsHandler(IConfigService configService, 
                IMapper mapper,
                ILogger<GetDealsHandler> logger
                )
            {
                _configService = configService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {

                try
                {
                    var deals = await _configService.GetDeals(request);
                    var recentDealResponse = _mapper.Map<Response>(deals);
                    recentDealResponse = new Response
                    {
                        Items = recentDealResponse.Items,
                        TotalItems = recentDealResponse.Items.Count(),
                        PageNumber = request.Criteria.Page,
                        PageSize = request.Criteria.PageSize,
                        PageCount = (recentDealResponse.Items.Count() + request.Criteria.PageSize - 1) / request.Criteria.PageSize,

                    };
                    return new ResponseBase<Response> { Content = recentDealResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting recent Deals for grid : " + nameof(GetDeals));
                    throw;
                }
            }
        
            public class Validator : AbstractValidator<FindModel>
            {
                public Validator()
                {
                    When(x => x.WithPaginationInfo.HasValue && x.WithPaginationInfo.Value, () =>
                    {
                        RuleFor(x => x.Page).NotEmpty().GreaterThan(0).WithMessage("Page must be greater than 0.");
                        RuleFor(x => x.PageSize).NotEmpty().GreaterThan(0).WithMessage("PageSize must be greater than 0.");
                    });
                }
                
            }
        
        }
    }
}
