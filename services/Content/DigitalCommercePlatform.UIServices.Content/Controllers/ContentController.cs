using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
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
        public async Task<ActionResult<GetCart.Response>> GetCartDetails(string userId, string customerId)
        {
            var response = await Mediator.Send(new GetCart.Request(userId, customerId)).ConfigureAwait(false);
            if (response.IsError && response.ErrorCode == "forbidden")
            {
                return StatusCode(StatusCodes.Status403Forbidden, response);
            }

            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, response);
            }

            return Ok(response);
        }
    }
}
