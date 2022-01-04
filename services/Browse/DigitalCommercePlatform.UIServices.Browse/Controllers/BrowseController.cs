//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Providers.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        /// Get the product details on the ProductId
        /// </summary>
        /// <param name="id"></param>
        /// <param name="details"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("product/details")]
        public async Task<ActionResult> GetProduct([FromQuery] IReadOnlyList<string> id)
        {
            var (salesOrg, site) = ContextHelper.ExtractSiteAndSalesOrgFromContext(Context, SalesOrg);

            if (salesOrg == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Active customer without salesorg and system");
            }

            var response = await Mediator.Send(new GetProductDetailsHandler.Request(id, salesOrg, site)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("getProductCatalog")]
        public async Task<IActionResult> GetProductCatalog([FromQuery] ProductCatalog input)
        {
            var response = await Mediator.Send(new GetProductCatalogHandler.Request(input)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("Detail/RelatedProducts")]
        public async Task<ActionResult<RelatedProductResponseModel>> RelatedProducts([FromQuery(Name = "id")] string[] ids, bool sameManufacturerOnly)
        {
            var response = await Mediator.Send(new GetRelatedProductsHandler.Request { ProductId = ids, SameManufacturerOnly = sameManufacturerOnly }).ConfigureAwait(false);
            return Ok(response);
        }
    }
}