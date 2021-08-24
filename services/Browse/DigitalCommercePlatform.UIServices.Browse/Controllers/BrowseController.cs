//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class BrowseController : BaseUIServiceController
    {
        public BrowseController(
            IMediator mediator,
            ILogger<BrowseController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        /// <summary>
        /// Get the Cart, Customer, Catalogue details in a single call
        /// </summary>
        /// <param name="catalogueCriteria"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("header")]
        public async Task<ActionResult<GetHeaderHandler.Response>> GetHeader(string catalogueCriteria, bool isDefault = true)
        {
            var response = await Mediator.Send(new GetHeaderHandler.Request(catalogueCriteria, isDefault)).ConfigureAwait(false);
            return Ok(response);
        }

        /// <summary>
        /// Get the Cart Name and Cart Id
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="customerId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("cart")]
        public async Task<ActionResult<ResponseBase<GetCartHandler.Response>>> GetCartDetails(bool isDefault = true)//(string userId, string customerId)
        {
            var response = await Mediator.Send(new GetCartHandler.Request(isDefault)).ConfigureAwait(false);
            return Ok(response);
        }

        /// <summary>
        /// Get the catalog details
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("catalogue")]
        public async Task<ActionResult<GetCatalogHandler.Response>> GetCatalog(string id)
        {
            var response = await Mediator.Send(new GetCatalogHandler.Request(id)).ConfigureAwait(false);
            return Ok(response);
        }

        /// <summary>
        /// Get the customer details
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("customer")]
        public async Task<ActionResult<GetCustomerHandler.Response>> GetCustomer()
        {
            var response = await Mediator.Send(new GetCustomerHandler.Request()).ConfigureAwait(false);
            return Ok(response);
        }

        /// <summary>
        /// Get the product details on the ProductId
        /// </summary>
        /// <param name="id"></param>
        /// <param name="details"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("product")]
        public async Task<ActionResult<object>> GetProduct([FromQuery] IReadOnlyList<string> id, [FromQuery] bool details)
        {
            if (details)
            {
                var response = await Mediator.Send(new GetProductDetailsHandler.Request(id, details)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new GetProductSummaryHandler.Request(id, details)).ConfigureAwait(false);
                return Ok(response);
            }
        }

        /// <summary>
        /// This method is used for the Searching the Products based on the category
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("product/summary")]
        public async Task<IActionResult> FindProduct([FromQuery] FindProductModel query, bool WithPaginationInfo = true)
        {
            if (query.Details)
            {
                var response = await Mediator.Send(new FindProductHandler.Request(query, WithPaginationInfo)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new FindSummaryHandler.Request(query, WithPaginationInfo)).ConfigureAwait(false);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("getProductCatalog")]
        public async Task<IActionResult> GetProductCatalog([FromQuery] ProductCatalog input)
        {
            var response = await Mediator.Send(new GetProductCatalogHandler.Request(input)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
