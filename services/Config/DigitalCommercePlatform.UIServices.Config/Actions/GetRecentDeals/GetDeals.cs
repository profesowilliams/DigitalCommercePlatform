using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
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
            public RecentDealsModel Deals { get; internal set; }
        }

        public class GetDealsHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IConfigService _configServiceQueryService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetDealsHandler> _logger;
            public GetDealsHandler(IConfigService commerceQueryService, 
                IMapper mapper,
                ILogger<GetDealsHandler> logger
                )
            {
                _configServiceQueryService = commerceQueryService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {

                try
                {
                    RecentDealsModel deals = await _configServiceQueryService.GetDeals(request.Criteria);
                    var recentDealResponse = _mapper.Map<Response>(deals);
                    return new ResponseBase<Response> { Content = recentDealResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting recent Deals for grid : " + nameof(GetDeals));
                    throw;
                }
            }
        }
    }
}
