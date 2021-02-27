using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines;

namespace DigitalCommercePlatform.UIServices.Commerce.Controllers
{
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseUIServiceController
    {
        public OrderController(
            IMediator mediator, 
            ILogger<OrderController> logger, 
            IContext context,
            IOptions<AppSettings> settings, 
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("order/{id}")]
        public async Task<ActionResult> GetOrderDetailsAsync([FromRoute] string id)
        {
            var orderResponse = await Mediator.Send(new GetOrder.Request(id)).ConfigureAwait(false);
            if (orderResponse.IsError && orderResponse.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, orderResponse);
            }
            else
            {
                return Ok(orderResponse);
            }
        }

        [HttpGet]
        [Route("orders")]
        public async Task<ActionResult> GetRecentOrdersAsync([FromBody] GetOrdersDto getOrdersRequest)
        {
            var getOrdersQuery = new GetOrders.Request(getOrdersRequest.Id, getOrdersRequest.Reseller, getOrdersRequest.CreatedFrom, getOrdersRequest.CreatedTo,
                                        getOrdersRequest.OrderBy, getOrdersRequest.PageNumber, getOrdersRequest.PageSize);

            var ordersResponse = await Mediator.Send(getOrdersQuery).ConfigureAwait(false);
            if (ordersResponse.IsError && ordersResponse.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, ordersResponse);
            }
            else
            {
                return Ok(ordersResponse);
            }
        }


        [HttpGet]
        [Route("orderLines/{id}")]
        public async Task<ActionResult> GetOrderLinesAsync([FromRoute] string id)
        {
            var orderLinesResponse = await Mediator.Send(new GetLines.Request(id)).ConfigureAwait(false);
            if (orderLinesResponse.IsError && orderLinesResponse.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, orderLinesResponse);
            }
            else
            {
                return Ok(orderLinesResponse);
            }
        }

    }
}
