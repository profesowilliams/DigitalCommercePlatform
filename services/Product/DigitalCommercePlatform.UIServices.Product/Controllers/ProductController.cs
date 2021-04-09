using MediatR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalCommercePlatform.UIServices.Product.Models.Find;
using DigitalCommercePlatform.UIServices.Product.Models.Search;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.FindProduct.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.FindSummarySearch.FindSummaryHandler;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.GetProductSummary.GetProductSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Product.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class ProductController : BaseUIServiceController
    {
        public ProductController(
            IMediator mediator,
            ILogger<ProductController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("Product/get")]
        public async Task<ActionResult<object>> Get(List<string> id, [FromQuery] bool details = true)
        {
            if (details)
            {
                var response = await Mediator.Send(new GetProductDetailsRequest(id,details)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new GetProductSummaryRequest(id, details)).ConfigureAwait(false);
                return Ok(response);
            }  
        }

        [HttpGet]
        [Route("Product/Find")]
        public async Task<IActionResult> FindProduct( FindProductModel query, [FromQuery] bool withPaginationInfo, [FromQuery] int page, [FromQuery] int pageSize,  [FromQuery] bool details = true)
        {
            if (details)
            {

                var response = await Mediator.Send(new GetProductRequest(query, withPaginationInfo, page, pageSize,details)).ConfigureAwait(false);
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new FindSummaryRequest(query, withPaginationInfo, page, pageSize,details)).ConfigureAwait(false);
                return Ok(response);
            }
        }



        [HttpGet]
        [Route("Search")]
        public async Task<IActionResult> Search(string keyword, string searchApplication = "SHOP")
        {
            var response = await Mediator.Send(new TypeAheadRequest { Keyword = keyword, SearchApplication = searchApplication }).ConfigureAwait(false);
            return Ok(response);
        }
    }
}