using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations
{
    [ExcludeFromCodeCoverage]
    public sealed class GetConfigurations
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public FindModel Criteria { get; set; }
        }

        public class Response
        {
            public RecentConfigurationsModel Configurations { get; internal set; }
        }

        public class GetConfigurationsHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IConfigService _configService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetConfigurationsHandler> _logger;

            public GetConfigurationsHandler(IConfigService configService, 
                IMapper mapper,
                ILogger<GetConfigurationsHandler> logger
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
                    RecentConfigurationsModel configurations = await _configService.GetConfigurations(request.Criteria);
                    var recentDealResponse = _mapper.Map<Response>(configurations);
                    return new ResponseBase<Response> { Content = recentDealResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting recent configurations for grid : " + nameof(GetConfigurations));
                    throw;
                }


            }
        }
    }
}
