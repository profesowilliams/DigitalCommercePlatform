//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Actions;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetSpa;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Models.Spa;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{version:apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class ProductController : BaseUIServiceController
    {
        public ProductController(
            IMediator mediator,
            ILogger<ProductController> logger,
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
        [Route("Details")]
        public async Task<ActionResult> GetProduct([FromQuery] IReadOnlyList<string> id, string orderLevel)
        {
            var (salesOrg, site) = ContextHelper.ExtractSiteAndSalesOrgFromContext(Context, SalesOrg);

            if (salesOrg == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Active customer without salesorg and system");
            }

            var response = await Mediator.Send(new GetProductDetailsHandler.Request(id, salesOrg, site, Context.Language, orderLevel)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("Variants")]
        public async Task<ActionResult> GetProductVariant([FromQuery] string id)
        {
            var response = await Mediator.Send(new GetProductVariantHandler.Request(id)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("RelatedProducts")]
        public async Task<ActionResult<RelatedProductResponseModel>> RelatedProducts([FromQuery(Name = "id")] string[] ids, bool sameManufacturerOnly, string orderLevel)
        {
            var response = await Mediator.Send(new GetRelatedProductsHandler.Request { ProductId = ids, SameManufacturerOnly = sameManufacturerOnly, OrderLevel = orderLevel }).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet("Compare")]
        public async Task<ActionResult> Get([FromQuery] string[] ids, string orderLevel)
        {
            var (salesOrg, site) = ContextHelper.ExtractSiteAndSalesOrgFromContext(Context, SalesOrg);

            if (salesOrg == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Active customer without salesorg and system");
            }
            var request = new GetProductsCompare.Request { Ids = ids, SalesOrg = salesOrg, Site = site, Culture = Context.Language, OrderLevel = orderLevel };

            var data = await Mediator.Send(request).ConfigureAwait(false);

            return Ok(data);
        }

        [HttpGet("Spa/{id}")]
        public async Task<ActionResult<IEnumerable<SpaResponseModel>>> GetSpa(string id)
        {
            var data = await Mediator.Send(new GetSpaHandler.Request { Id = id, Culture = Context.Language }).ConfigureAwait(false);

            if (data == null || !data.Any())
                return NoContent();

            return Ok(data);
        }
    }
}