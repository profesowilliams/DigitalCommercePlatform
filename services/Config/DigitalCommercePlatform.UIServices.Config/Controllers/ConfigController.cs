using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    public class ConfigController : BaseUIServiceController
    {
        public ConfigController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            IOptions<AppSettings> options,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }
        [HttpPost]
        [Route("configurations/find")]
        public async Task<ActionResult> GetConfigurations([FromBody] Models.Configurations.FindModel criteria)
        {
            var data = new GetConfigurations.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);

        }
        [HttpPost]
        [Route("deals/find")]
        public async Task<ActionResult> GetDeals([FromBody] Models.Deals.FindModel criteria)
        {
            var data = new GetDeals.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            return Ok(response);

        }

        [HttpPost]
        [Route("deals/get")]
        public async Task<ActionResult> GetDeal([FromBody] Models.Deals.FindModel criteria)
        {
            var data = new GetDeal.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest);
            }

            return Ok(response);

        }
    }
}
