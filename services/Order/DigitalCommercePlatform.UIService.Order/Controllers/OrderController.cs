using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Controllers
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
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersAsync([FromQuery] string orderBy,int pageNumber, int pageSize)
        {
            var ordersResponse = await Mediator.Send(new GetOrdersQuery(orderBy,pageNumber,pageSize));
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
    }
}