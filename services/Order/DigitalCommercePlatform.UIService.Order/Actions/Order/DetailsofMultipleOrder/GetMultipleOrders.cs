using System;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using DigitalFoundation.Common.Client;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Extensions;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;


namespace DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofMultipleOrder
{
    [ExcludeFromCodeCoverage]
    public class GetMultipleOrders
    {
        public class Request : IRequest<IEnumerable<SalesOrderModel>>
        {
            public IReadOnlyList<string> Id { get; set; }
        }

        public class Handler : IRequestHandler<Request, IEnumerable<SalesOrderModel>>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<GetMultipleOrders> _logger;
            private readonly string _appOrderUrl;


            public Handler(IMiddleTierHttpClient client, ILogger<GetMultipleOrders> logger)
            {
                _client = client;
                _logger = logger;
                _appOrderUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1";
            }

            public async Task<IEnumerable<SalesOrderModel>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    _logger.LogInformation($"UIService.Order.GetOrder");
                    var url = $"{_appOrderUrl}/"
                    .BuildQuery(request);

                    var AppResponse = await _client.GetAsync<IEnumerable<SalesOrderModel>>(url).ConfigureAwait(false);
                    return AppResponse;
                }

                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at: " + nameof(GetMultipleOrders));
                    throw;
                }
            }
        }

    }
}
