//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Order;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Security.PolicyAuthorization.Attributes;
using DigitalFoundation.Common.Providers.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using DigitalFoundation.Common.Services.Layer.UI;

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
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }
        /// <summary>
        /// returns order detials
        /// </summary>
        /// <param name="id">orer id</param>
        /// <returns></returns>
        [HttpGet]
        [RoleAuthorize(Roles = "CanViewOrders")]
        [Route("order")]
        public async Task<ActionResult> GetOrderDetailsAsync([FromQuery] string id)
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

        /// <summary>
        /// for Grid and search
        /// </summary>
        /// <param name="getOrdersRequest"></param>
        /// <returns></returns>
        [HttpGet]
        [RoleAuthorize(Roles = "CanViewOrders")]
        [Route("orders")]
        public async Task<ActionResult> GetRecentOrdersAsync([FromQuery] GetOrdersDto getOrdersRequest)
        {
            var filtering = new GetOrders.FilteringDto(getOrdersRequest.Id, getOrdersRequest.Reseller, getOrdersRequest.Vendor,
                getOrdersRequest.CreatedFrom, getOrdersRequest.CreatedTo,getOrdersRequest.Status,getOrdersRequest.OrderMethod,
                getOrdersRequest.ConfirmationNumber, getOrdersRequest.InvoiceId, getOrdersRequest.IdType);

            var paging = new GetOrders.PagingDto(getOrdersRequest.SortBy, getOrdersRequest.SortDirection, getOrdersRequest.PageNumber, getOrdersRequest.PageSize, getOrdersRequest.WithPaginationInfo);

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
        /// <summary>
        /// returns order lines 
        /// </summary>
        /// <param name="id">order id</param>
        /// <returns></returns>
        [HttpGet]
        [RoleAuthorize(Roles = "CanViewOrders")]
        [Route("orderLines")]
        public async Task<ActionResult> GetOrderLinesAsync([FromQuery] string id)
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

        /// <summary>
        /// returns order levels (pricing conditions/Tiers) 
        /// </summary>
        /// <param name="getAll"></param>
        /// <param name="Id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("orderLevel")]
        public async Task<ActionResult> GetPricingConditions([FromQuery] bool getAll, bool isSPAFind, string Id)
        {
            var getPricingCondition = await Mediator.Send(new GetPricingConditions.Request(getAll, isSPAFind, Id)).ConfigureAwait(false);
            if (getPricingCondition.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, getPricingCondition);
            }
            else
            {
                return Ok(getPricingCondition);
            }
        }

        /// <summary>
        /// download invoices
        /// </summary>
        /// <param name="orderId"></param>
        /// <param name="invoiceId"></param>
        /// <param name="downloadAll"></param>
        /// <returns></returns>
        [HttpGet]
        [RoleAuthorize(Roles = "CanViewInvoices")]
        [Route("downloadInvoice")]        
        public async Task<ActionResult> DownloadInvoice([FromQuery] string orderId, string invoiceId, bool downloadAll)
        {
            var response = await Mediator.Send(new DownloadInvoice.Request(orderId, invoiceId, downloadAll)).ConfigureAwait(false);
            if (response?.Content?.BinaryContent == null) 
                return new NotFoundResult();

            return new FileContentResult(response.Content.BinaryContent, response.Content.MimeType);
        }
    }
}
