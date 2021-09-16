//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetPunchOutUrl;
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
        /// <summary>
        /// This request is being used for Configuration grid
        /// </summary>
        /// <param name="criteria"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("configurations")]
        public async Task<ActionResult> GetRecentConfigurations([FromQuery] FindModel criteria)
        {
            var data = new GetConfigurations.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }
        /// <summary>
        /// This request is for applying Deals in Quote details
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("getDealsFor")]
        public async Task<ActionResult> GetDealFor([FromQuery] GetDealsFor.Request request )
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }
        /// <summary>
        /// This request is for SPA Grid
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("deals")]
        public async Task<ActionResult> GetDeals([FromQuery] GetDeals.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }
        /// <summary>
        /// This request is for deals details but returning dummy data (no requirment to show deals details)
        /// </summary>
        /// <param name="dealId"></param>
        /// <param name="vendorId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("deal")]
        public async Task<ActionResult> GetDeal([FromQuery] string dealId, string vendorId)
        {
            var data = new GetDeal.Request(dealId, vendorId);
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }
        /// <summary>
        /// This request is for validating the configurationId's
        /// </summary>
        /// <param name="criteria"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("estimations/validate")]
        public async Task<ActionResult> EstimationValidate([FromQuery] FindModel criteria)
        {
            var data = new EstimationValidate.Request(criteria);
            var response = await Mediator.Send(data).ConfigureAwait(false);
            return Ok(response);
        }
        /// <summary>
        /// This request will create/edit the PunchoutUrl with ConfigId's (Only applicable to CISCO)
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("getPunchOutUrl")]
        public async Task<ActionResult> GetPunchOutUrl(GetPunchOutUrl.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
