using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofOrder
{
    public sealed class GetOrder
    {
        public class Request : IRequest<SalesOrderModel>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Request, SalesOrderModel>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<GetOrder> _logger;
            private readonly string _AppOrderUrl;

            public Handler(IMiddleTierHttpClient client, ILogger<GetOrder> logger)
            {
                _client = client ?? throw new ArgumentNullException(nameof(client));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));

                //TODO : Could be better to move URL-value into appsettings.json
                _AppOrderUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1";
            }

            public async Task<SalesOrderModel> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Order.GetOrder");
                    var url = $"{_AppOrderUrl}/"
                    .BuildQuery(request);

                    var coreResponse = await _client.GetAsync<List<SalesOrderModel>>(url).ConfigureAwait(false);
                    return coreResponse.FirstOrDefault();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(GetOrder));
                    throw;
                }
            }
        }
    }
}