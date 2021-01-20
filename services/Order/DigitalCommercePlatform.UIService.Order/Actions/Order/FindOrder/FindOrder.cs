using AutoMapper;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Actions.Order.FindOrder
{
    public class FindOrder
    {
        public class Request : IRequest<Response>
        {
            public FindRequestModel SearchQuery { get; set; }
        }

        public class Response
        {
            public long Count { get; set; }
            public IEnumerable<SalesOrderModel> Data { get; set; }
            public Response(IEnumerable<SalesOrderModel> orders)
            {
                Data = orders;
            }
        }
        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;
            private readonly string _AppOrderUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<Handler> logger)
            {
                _mapper = mapper;
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
                       .BuildQuery(request)
                       ;

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
