using System;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using DigitalFoundation.Common.Client;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Extensions;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;

namespace DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofOrder
{
    [ExcludeFromCodeCoverage]
    public class GetOrder 
    {
        public class Request : IRequest<SalesOrderModel>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Request, SalesOrderModel>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<GetOrder> _logger;
            private readonly string _appOrderUrl;


            public Handler(IMiddleTierHttpClient client, ILogger<GetOrder> logger )
            {
                _client = client ?? throw new ArgumentNullException(nameof(client));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
                _appOrderUrl = "https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1";
            }

            public async Task<SalesOrderModel> Handle(Request request, CancellationToken cancellationToken)
            {
               try
                {
                    _logger.LogInformation($"UIService.Order.GetOrder");

                    //------------Need to implement passing the headers to the client-------------------------
                    //_client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
                    //_client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
                    //_client.DefaultRequestHeaders.Add("Accept-Language", "en-us");
                    //_client.DefaultRequestHeaders.Add("Site", "NA");
                    //_client.DefaultRequestHeaders.Add("Consumer", "NA");

                    var url = _appOrderUrl.BuildQuery(request);

                    var appResponse = await _client.GetAsync<IEnumerable<SalesOrderModel>>(url).ConfigureAwait(false);
                    return appResponse.FirstOrDefault();
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
