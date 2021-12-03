//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.Redirect;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Providers.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class RedirectController : BaseUIServiceController
    {
        public RedirectController(
            IMediator mediator,
            ILogger<RedirectController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("KeywordSearch")]
        public async Task<ActionResult> KeywordSearch(string keyword)
        {
            var data = await Mediator.Send(new KeywordSearch.Request(keyword)).ConfigureAwait(false);

            if (data?.Results == null)
                return StatusCode(StatusCodes.Status405MethodNotAllowed);

            return Ok(data);
        }
    }
}