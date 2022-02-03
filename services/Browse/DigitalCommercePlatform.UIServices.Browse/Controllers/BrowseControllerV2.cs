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
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [ApiVersion("2")]
    [Route("/v{version:apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class BrowseControllerV2 : BaseUIServiceController
    {
        public BrowseControllerV2(
           IMediator mediator,
           ILogger<BrowseControllerV2> logger,
           IUIContext context,
           IAppSettings appSettings,
           ISiteSettings siteSettings)
           : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("getProductCatalog")]
        [MapToApiVersion("2")]
        public async Task<IActionResult> GetProductCatalogV2([FromQuery] ProductCatalogRequest input)
        {
            var response = await Mediator.Send(new GetProductCatalogHandlerV2.Request(input)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
