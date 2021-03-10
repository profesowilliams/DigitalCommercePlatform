using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Account.Actions.DetailsOfSavedCart.GetCartDetails;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    public class DashBoardController : BaseUIServiceController
    {
        public DashBoardController(IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }
        [HttpGet]
        [Route("getConfigurationsSummary")]
        public async Task<IActionResult> GetConfigurationsSummary([FromQuery] string criteria)
        {
            var request = new GetConfigurationsSummary.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("getDealsSummary")]
        public async Task<IActionResult> GetDealsSummary([FromQuery] string criteria)
        {
            var request = new GetDealsSummary.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("savedCarts")]
        public async Task<ActionResult<GetCartResponse>> GetCartDetails(string Id)
        {
            var response = await Mediator.Send(new GetCartRequest(Id)).ConfigureAwait(false);
            return response;
        }
    }
}
