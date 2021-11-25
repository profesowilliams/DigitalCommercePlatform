//2021 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.Refresh
{
    public class Refresh
    {
        public class Request : INotification
        {
            public string ProviderName { get; set; }
            public string ConfigurationType { get; set; }
            public string Version { get; set; }
            public string UserId { get; set; }
            public string CustomerNumber { get; set; }
            public IQueryCollection QueryParams { get; set; }
        }

        public class Handler : HandlerBase<Handler>, INotificationHandler<Request>
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

            public async Task Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    await _configService.Refresh(request).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception in refresh configurations, Handler : " + nameof(Handler));
                    throw;
                }
            }
        }
    }
}
