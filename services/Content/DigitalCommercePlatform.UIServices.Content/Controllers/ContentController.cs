using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [SetContextFromHeader]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class ContentController : BaseUIServiceController
    {
        public ContentController(
            IMediator mediator,
            ILogger<ContentController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }
        [HttpGet]
        [Route("cart/get")]
        public async Task<ActionResult<GetCart.Response>> GetCartDetails(string id)
        {
            var response = await Mediator.Send(new GetCart.Request(id)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
