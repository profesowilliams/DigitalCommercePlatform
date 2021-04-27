using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Controllers
{
    [ApiController]
    [SetContextFromHeader]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseUIServiceController
    {
        public OrderController(
            IMediator mediator, 
            ILogger<OrderController> logger, 
            IUIContext context,
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
            if (orderResponse.Error.IsError)
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
        public async Task<ActionResult> GetRecentOrdersAsync([FromQuery] GetOrdersDto getOrdersRequest)
        {
            var filtering = new GetOrders.FilteringDto(getOrdersRequest.Id, getOrdersRequest.Reseller, getOrdersRequest.Vendor,
                getOrdersRequest.CreatedFrom, getOrdersRequest.CreatedTo);

            var paging = new GetOrders.PagingDto(getOrdersRequest.SortBy, getOrdersRequest.SortAscending, getOrdersRequest.PageNumber, getOrdersRequest.PageSize);

            var getOrdersQuery = new GetOrders.Request(filtering, paging);

            var ordersResponse = await Mediator.Send(getOrdersQuery).ConfigureAwait(false);
            if (ordersResponse.Error.IsError)
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
            if (orderLinesResponse.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, orderLinesResponse);
            }
            else
            {
                return Ok(orderLinesResponse);
            }
        }
        [HttpGet]
        [Route("pricingConditions")]
        public async Task<ActionResult> GetPricingConditions([FromRoute] bool getAll,string Id)
        {
            var getPricingCondition = await Mediator.Send(new GetPricingConditions.Request(getAll,Id)).ConfigureAwait(false);
            if (getPricingCondition.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, getPricingCondition);
            }
            else
            {
                return Ok(getPricingCondition);
            }
        }

    }
}
