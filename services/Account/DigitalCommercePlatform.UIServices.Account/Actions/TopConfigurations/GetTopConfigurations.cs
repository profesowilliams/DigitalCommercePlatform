using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations
{
    [ExcludeFromCodeCoverage]
    public sealed class GetTopConfigurations
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public int? Top { get; set; }
        }

        public class Response
        {
            public ActiveOpenConfigurationsModel Summary { get; set; }            
        }

        public class GetTopConfigurationsQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetTopConfigurationsQueryHandler> _logger;

            public GetTopConfigurationsQueryHandler(IAccountService accountService, 
                IMapper mapper,
                ILogger<GetTopConfigurationsQueryHandler> logger
                )
            {
                _accountService = accountService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    ActiveOpenConfigurationsModel configurations = await _accountService.GetTopConfigurationsAsync(request);
                    var getConfigurations = _mapper.Map<Response>(configurations);
                    
                    return new ResponseBase<Response> { Content = getConfigurations };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting ConfigurationsSummaryQueryHandler  : " + nameof(GetTopConfigurationsQueryHandler));
                    throw;
                }

            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Top).GreaterThan(4);
            }
        }
    }
}
