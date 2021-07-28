using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations
{
    [ExcludeFromCodeCoverage]
    public class GetConfigurations
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public FindModel Criteria { get; set; }
        }

        public class Response : PaginatedResponse<Configuration>
        {
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            public Handler(
                ILoggerFactory loggerFactory,
                IConfigService configService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _configService = configService;
            }

            protected readonly IConfigService _configService;

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var configurations = await _configService.FindConfigurations(request).ConfigureAwait(false);
                    var getRecentConfigurationContent = new Response
                    {
                        TotalItems = configurations.Count,
                        PageNumber = request.Criteria.PageNumber,
                        PageSize = request.Criteria.PageSize,
                        Items = configurations,
                    };
                    return new ResponseBase<Response> { Content = getRecentConfigurationContent };
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception at searching configurations, Handler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Criteria.PageNumber).GreaterThan(0)
                    .WithMessage("PageNumber must be greater than 0.");
                RuleFor(x => x.Criteria.PageSize).GreaterThan(0)
                    .WithMessage("PageSize must be greater than 0.");
                RuleFor(x => x.Criteria.SortDirection).IsInEnum();
            }
        }
    }
}