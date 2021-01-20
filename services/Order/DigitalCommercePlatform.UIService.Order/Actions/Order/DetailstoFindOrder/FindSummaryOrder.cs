using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Actions.Order.DetailstoFindOrder
{
    [ExcludeFromCodeCoverage]
    public class FindSummaryOrder
    {
        public class Request : IRequest<Response>
        {
            public FindRequestModel SearchQuery { get; set; }
        }

        public class Response
        {
            public IEnumerable<SummaryModel> Data { get; set; }
            public long Count { get; set; }
            public Response() { }
            public Response(IEnumerable<SummaryModel> orders)
            {
                Data = orders ?? throw new ArgumentNullException(nameof(orders));
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<Handler> _logger;
            private readonly string _AppOrderUrl;

            public Handler( IMiddleTierHttpClient client, ILogger<Handler> logger)
            {
                _client = client;
                _logger = logger;
                _AppOrderUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1/Find";
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {

                try
                {
                    _logger.LogInformation($"UIService.Order.FindOrder");
                    var url = $"{_AppOrderUrl}/"
                       .BuildQuery(request);

                    var data = await _client.GetAsync<Response>(url).ConfigureAwait(false);
                    return data;

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(FindOrder));
                    throw;
                }
            }
        }
    }
}
