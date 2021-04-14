using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{api0Version}")]
    public class ConfigController : BaseUIServiceController
    {
        public ConfigController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            IOptions<AppSettings> options,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }
        [HttpGet]
        [Route("configurations/find")]
        public async Task<ActionResult> GetConfigurations([FromQuery] Models.Configurations.FindModel criteria)
        {
            var data = new GetConfigurations.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            //if (response.IsError)
            //{
            //    return StatusCode(StatusCodes.Status400BadRequest, response);
            //}

            return Ok(response);

        }
        [HttpGet]
        [Route("deals/find")]
        public async Task<ActionResult> GetDeals([FromQuery] Models.Deals.FindModel criteria)
        {
            var data = new GetDeals.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            //if (response.IsError)
            //{
            //    return StatusCode(StatusCodes.Status400BadRequest);
            //}

            return Ok(response);

        }

        [HttpGet]
        [Route("deals")]
        public async Task<ActionResult> GetDeal([FromQuery] string dealId, string vendorId)
        {
            var data = new GetDeal.Request(dealId, vendorId) ;
            var response = await Mediator.Send(data).ConfigureAwait(false);
            //if (response.IsError)
            //{
            //    return StatusCode(StatusCodes.Status400BadRequest);
            //}

            return Ok(response);

        }
    }
}
