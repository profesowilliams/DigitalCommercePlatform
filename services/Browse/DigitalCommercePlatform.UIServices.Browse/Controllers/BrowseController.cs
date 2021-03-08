using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails.GetCartHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails.GetCatalogHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails.GetCustomerHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails.GetHeaderHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails.GetProductSummaryHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary.FindSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    public class BrowseController : BaseUIServiceController
    {
        public BrowseController(
            IMediator mediator,
            ILogger<BrowseController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("header/get")]
        public async Task<ActionResult<GetHeaderResponse>> GetHeader(string userId, string customerId, string catalogueCriteria)
        {
            var response = await Mediator.Send(new GetHeaderRequest(customerId, userId, catalogueCriteria)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("cart/get")]
        public async Task<ActionResult<GetCartResponse>> GetCartDetails(string userId, string customerId)
        {
            var response = await Mediator.Send(new GetCartRequest(userId, customerId)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("catalogue/get")]
        public async Task<ActionResult<GetCatalogResponse>> GetCatalog(string id)
        {
            var response = await Mediator.Send(new GetCatalogRequest(id)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("customer/get")]
        public async Task<ActionResult<GetCustomerResponse>> GetCustomer(string id)
        {
            var response = await Mediator.Send(new GetCustomerRequest(id)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("Product/get")]
        public async Task<ActionResult<object>> GetProduct([FromQuery] IReadOnlyList<string> id, [FromQuery] bool details = true)
        {
            if (details)
            {
                var response = await Mediator.Send(new GetProductDetailsRequest(id, details)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new GetProductSummaryRequest(id, details)).ConfigureAwait(false);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("product/summary")]
        public async Task<IActionResult> FindProduct([FromQuery] FindProductModel query, [FromQuery] bool details = true)
        {
            if (details)
            {
                var response = await Mediator.Send(new GetProductRequest(query, details)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new FindSummaryRequest(query, details)).ConfigureAwait(false);
                return Ok(response);
            }
        }
    }
}