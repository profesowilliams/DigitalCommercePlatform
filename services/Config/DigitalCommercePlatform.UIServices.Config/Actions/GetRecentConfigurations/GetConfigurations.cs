using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
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
            public long? TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int? PageNumber { get; set; }
            public int? PageSize { get; set; }
            public List<Configuration> Items { get; internal set; }
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
                    var configurations = await _configService.GetConfigurations(request);
                    var recentConfigResponse = _mapper.Map<Response>(configurations);
                    recentConfigResponse = new Response
                    {
                        Items = recentConfigResponse.Items,
                        TotalItems = recentConfigResponse.Items.Count(),
                        PageNumber = request.Criteria.Page,
                        PageSize = request.Criteria.PageSize,
                        PageCount = (recentConfigResponse.Items.Count() + request.Criteria.PageSize - 1) / request.Criteria.PageSize

                    };
                    return new ResponseBase<Response> { Content = recentConfigResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting recent configurations for grid : " + nameof(GetConfigurations));
                    throw;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Criteria.PageSize).NotEmpty().GreaterThan(0).WithMessage("Page must be greater than 0.");
                RuleFor(x => x.Criteria.Page).NotEmpty().GreaterThan(0).WithMessage("PageSize must be greater than 0.");
            }
        }
    }
}
