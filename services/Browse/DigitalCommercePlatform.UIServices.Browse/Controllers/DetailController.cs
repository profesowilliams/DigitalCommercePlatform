//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [Obsolete("Deprecated. Use CatalogController instead.", false)]
    [SetContextFromHeader]
    [ApiController]
    [ApiVersion("1")]    
    [Route("/v{version:apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public partial class DetailController : BaseUIServiceController
    {
        public DetailController(
            IMediator mediator,
            ILogger<DetailController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [Obsolete("Deprecated. Use CatalogController instead.", false)]
        [HttpGet]
        [Route("getProductCatalog")]
        public async Task<IActionResult> GetProductCatalog([FromQuery] ProductCatalogRequest input)
        {
            var response = await Mediator.Send(new GetProductCatalogHandler.Request(input)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}