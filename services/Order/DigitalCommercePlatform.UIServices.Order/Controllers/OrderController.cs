using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetSingleOrder;
using DigitalCommercePlatform.UIServices.Order.Models.Requests;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Controllers
{
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseUIServiceController
    {
        
        public OrderController(IMediator mediator,ILogger<OrderController> logger,IContext context,
            IOptions<AppSettings> settings,ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersAsync([FromQuery] GetOrdersRequest getOrdersRequest)
        {
            var getOrdersQuery = new GetOrdersQuery(getOrdersRequest.Id, getOrdersRequest.Reseller, getOrdersRequest.Vendor, getOrdersRequest.CreatedFrom, getOrdersRequest.CreatedTo, 
                                        getOrdersRequest.OrderBy, getOrdersRequest.PageNumber, getOrdersRequest.PageSize);

            var ordersResponse = await Mediator.Send(getOrdersQuery);
            return Ok(ordersResponse);
        }

        [HttpGet]
        [Route("orders/{id}/lines")]
        public async Task<ActionResult<IEnumerable<OrderLineResponse>>> GetOrderLinesAsync([FromRoute] string id)
        {
            var orderLinesResponse = await Mediator.Send(new GetOrderLinesQuery(id));

            if (orderLinesResponse == null)
            {
                return NotFound();
            }

            return Ok(orderLinesResponse);
        }

        [HttpGet]
        [Route("orders/{id}/details")]
        public async Task<ActionResult<SingleOrderResponse>> GetSingleOrderAsync([FromRoute] string id)
        {
            var orderResponse = await Mediator.Send(new GetSingleOrderQuery(id));

            if (orderResponse == null)
            {
                return NotFound();
            }

            return Ok(orderResponse);
        }
    }
}