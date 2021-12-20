//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
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
            public Response(FindResponse<Configuration> findResponse, IPaginated request)
                : base(findResponse, request)
            {
            }
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IConfigService _configService;

            public Handler(
                ILoggerFactory loggerFactory,
                IConfigService configService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _configService = configService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    request.Criteria.Id = request.Criteria.ConfigId ?? request.Criteria.Id;
                    var findResponse = await _configService.FindConfigurations(request).ConfigureAwait(false);
                    return new ResponseBase<Response> { Content = new Response(findResponse, request.Criteria) };
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
