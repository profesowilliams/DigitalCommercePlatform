using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ExcludeFromCodeCoverage]
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
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("header/get")]
        public async Task<ActionResult<GetHeaderHandler.Response>> GetHeader(string userId, string customerId, string catalogueCriteria)
        {
            var response = await Mediator.Send(new GetHeaderHandler.Request(customerId, userId, catalogueCriteria)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("cart/get")]
        public async Task<ActionResult<ResponseBase<GetCartHandler.Response>>> GetCartDetails(string userId, string customerId)
        {
            var response = await Mediator.Send(new GetCartHandler.Request(userId, customerId)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("catalogue/get")]
        public async Task<ActionResult<GetCatalogHandler.Response>> GetCatalog(string id)
        {
            
            var response = await Mediator.Send(new GetCatalogHandler.Request(id)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("customer/get")]
        public async Task<ActionResult<GetCustomerHandler.Response>> GetCustomer([FromQuery] string id)
        {
            var response = await Mediator.Send(new GetCustomerHandler.Request(id)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("Product/get")]
        public async Task<ActionResult<object>> GetProduct([FromQuery] IReadOnlyList<string> id, [FromQuery] bool details = true)
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

        [HttpGet]
        [Route("product/summary")]
        public async Task<IActionResult> FindProduct([FromQuery] FindProductModel query)
        {
            if (query.Details)
            {
                var response = await Mediator.Send(new FindProductHandler.Request(query)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new FindSummaryHandler.Request(query)).ConfigureAwait(false);
                return Ok(response);
            }
        }
    }
}