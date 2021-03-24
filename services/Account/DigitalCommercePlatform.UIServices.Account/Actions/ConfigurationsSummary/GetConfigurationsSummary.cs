using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary
{
    [ExcludeFromCodeCoverage]
    public sealed class GetConfigurationsSummary
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public ConfigurationsSummaryModel Summary { get; set; }
        }
        public class ConfigurationsSummaryQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountQueryService;
            private readonly IMapper _mapper;
            private readonly ILogger<ConfigurationsSummaryQueryHandler> _logger;
            public ConfigurationsSummaryQueryHandler(IAccountService accountQueryService,
                IMapper mapper,
                ILogger<ConfigurationsSummaryQueryHandler> logger
                )
            {
                _accountQueryService = accountQueryService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    ConfigurationsSummaryModel configurations = await _accountQueryService.GetConfigurationsSummaryAsync(request);
                    var getConfigurations = _mapper.Map<Response>(configurations);
                    return new ResponseBase<Response> { Content = getConfigurations };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting ConfigurationsSummaryQueryHandler  : " + nameof(ConfigurationsSummaryQueryHandler));
                    throw;
                }
            }
        }
    }
}
