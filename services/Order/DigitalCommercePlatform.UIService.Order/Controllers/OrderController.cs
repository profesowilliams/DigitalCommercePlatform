using System;
using MediatR;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailstoFindOrder;
using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofOrder;
using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofMultipleOrder;

namespace DigitalCommercePlatform.UIService.Order.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseUIServiceController
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public OrderController(
            IMediator mediator,
            ILogger<OrderController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings,
            IHttpClientFactory httpClientFactory)
            : base(mediator, logger, context, settings, siteSettings)
        {
            _httpClientFactory = httpClientFactory;
        }

       
        [HttpGet]
        [Route("id")]
        public async Task<SalesOrderModel> GetAsync(string id)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");

            var response = await Mediator.Send(new GetOrder.Request { Id = id }).ConfigureAwait(false);
            return response;
        }



        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<SalesOrderModel>> GetMultiple([FromQuery(Name = "id")] List<string> id)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var response = await Mediator.Send(new GetMultipleOrders.Request()
            {
                Id = id
            }).ConfigureAwait(false);
            return response;
        }


        [HttpGet]
        [Route("Find")]
        public async Task<IActionResult> SearchAsync([FromQuery] FindRequestModel search)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            if (search == null)
            {
                throw new ArgumentNullException(nameof(search));
            }
            if (search.Details)
            {
                var findResponse = await Mediator.Send(new FindOrder.Request { SearchQuery = search }).ConfigureAwait(false);

                if (findResponse?.Data?.Any() != true)
                    return NotFound();
                else
                    return Ok(findResponse);
            }

            var findSummaryResponse = await Mediator.Send(new FindSummaryOrder.Request { SearchQuery = search }).ConfigureAwait(false);

            if (findSummaryResponse?.Data?.Any() != true)
                return NotFound();
            else
                return Ok(findSummaryResponse);

        }
    }
}
