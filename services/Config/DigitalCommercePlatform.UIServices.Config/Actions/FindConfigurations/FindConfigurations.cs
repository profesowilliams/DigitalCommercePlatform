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
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.FindConfigurations
{
    [ExcludeFromCodeCoverage]
    public class FindConfigurations
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public FindModel Criteria { get; set; }

            public Request()
            {
            }
        }

        public class Response
        {
            public long? TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int? Page { get; set; }
            public int? PageSize { get; set; }
            public IEnumerable<Configuration> Items { get; set; }

        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly IConfigService _configService;

            public Handler(IMapper mapper, ILogger<Handler> logger, IConfigService configService)
            {
                _mapper = mapper;
                _logger = logger;
                _configService = configService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var configurations = await _configService.FindConfigurations(request).ConfigureAwait(false);
                    var findConfigurationContent = new Response
                    {
                        Items = configurations,
                        TotalItems = configurations?.Count,
                        Page = request.Criteria.Page,
                        PageSize = request.Criteria.PageSize,
                        PageCount = (configurations?.Count + request.Criteria.PageSize - 1) / request.Criteria.PageSize

                    };
                    return new ResponseBase<Response> { Content = findConfigurationContent };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at searching configurations, Handler : " + nameof(Handler));
                    throw;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.Criteria.Page).GreaterThan(0).WithMessage("Page Size must be greater than 0.");
                RuleFor(i => i.Criteria.PageSize).GreaterThan(0).WithMessage("PageNumber must be greater than or equal to 0.");
            }
        }
    }
}
