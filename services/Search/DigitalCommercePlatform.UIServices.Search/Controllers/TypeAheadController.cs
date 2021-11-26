//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [SetContextFromHeader]
    [Route("/v{apiVersion}/[controller]")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class TypeAheadController : BaseUIServiceController
    {
        public TypeAheadController(
            IMediator mediator,
            ILogger<TypeAheadController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> TypeAhead([FromQuery] string keyword)
        {
            var response = await Mediator.Send(new TypeAhead.Request(keyword)).ConfigureAwait(false);
            return Ok(response.Results);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ProductSearchPreview")]
        public async Task<ActionResult> TypeAheadProductSearchPreview(string keyword, string categoryId)
        {
            var response = await Mediator.Send(new ProductSearchPreview.Request(keyword, categoryId)).ConfigureAwait(false);
            return Ok(response.Results);
        }
    }
}
