//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
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
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<ConfigurationsSummaryQueryHandler> _logger;

            public ConfigurationsSummaryQueryHandler(IAccountService accountService,
                IMapper mapper,
                ILogger<ConfigurationsSummaryQueryHandler> logger
                )
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                ConfigurationsSummaryModel configurations = await _accountService.GetConfigurationsSummaryAsync(request);
                var getConfigurations = _mapper.Map<Response>(configurations);
                return new ResponseBase<Response> { Content = getConfigurations };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Criteria).NotNull();
            }
        }
    }
}
