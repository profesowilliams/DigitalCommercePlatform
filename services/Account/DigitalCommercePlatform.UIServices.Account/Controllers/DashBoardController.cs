using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
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
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Filters;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
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
        [Route("configurationsSummary/get")]
        public async Task<IActionResult> GetConfigurationsSummary([FromQuery] string criteria)
        {
            GetConfigurationsSummary.Request request = new GetConfigurationsSummary.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("dealsSummary/get")]
        public async Task<IActionResult> GetDealsSummary([FromQuery] string criteria)
        {
            GetDealsSummary.Request request = new GetDealsSummary.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("actionItems/get")]
        public async Task<IActionResult> GetActionItems([FromQuery] string criteria)
        {
            GetActionItems.Request request = new GetActionItems.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("topQuotes/get")]
        public async Task<IActionResult> GetTopQuotes([FromQuery] int top)
        {
            var request = new GetTopQuotes.Request { Top = top };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("topConfigurations/get")]
        public async Task<IActionResult> GetTopConfigurations([FromQuery] int top)
        {
            var request = new GetTopConfigurations.Request { Top = top };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }


        [HttpGet]
        [Route("savedCarts/get")]
        public async Task<IActionResult> GetSavedCartList([FromQuery] bool getAll, int maximumSavedCarts)
        {
            var response = await Mediator.Send(new GetCartsList.Request(getAll, maximumSavedCarts)).ConfigureAwait(false);
            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("renewals/get")]
        public async Task<IActionResult> GetRenewals([FromQuery] string criteria)
        {
            var request = new GetRenewalsSummary.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }
    }
}
