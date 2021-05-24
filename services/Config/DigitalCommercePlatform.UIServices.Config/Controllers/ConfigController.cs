using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Config.Actions.GetEstimations;

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
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("configurations")]
        public async Task<ActionResult> GetRecentConfigurations([FromQuery] FindModel criteria)
        {
            var data = new GetConfigurations.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("deals/find")]
        public async Task<ActionResult> GetDeals([FromQuery] Models.Deals.FindModel criteria)
        {
            var data = new GetDeals.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("deals")]
        public async Task<ActionResult> GetDeal([FromQuery] string dealId, string vendorId)
        {
            var data = new GetDeal.Request(dealId, vendorId);
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("estimations")]
        public async Task<ActionResult> GetEstimations()
        {
            var data = new GetEstimations.Request();
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("estimations/validate/{id}")]
        public async Task<ActionResult> EstimationValidate(string id)
        {
            var data = new EstimationValidate.Request { Id = id };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }
    }
}