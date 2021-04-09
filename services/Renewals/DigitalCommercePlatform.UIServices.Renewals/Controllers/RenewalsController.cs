using DigitalCommercePlatform.UIServices.Renewals.Actions.GetRenewals;
using DigitalCommercePlatform.UIServices.Renewals.Actions.GetSummary;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
   //[Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class RenewalsController : BaseUIServiceController
    {
        public RenewalsController(
           IMediator mediator,
           ILogger<BaseUIServiceController> loggerFactory,
           IContext context,
           IOptions<AppSettings> options,
           ISiteSettings siteSettings,
           IHttpClientFactory httpClientFactory

           )
           : base(mediator, loggerFactory, context, options, siteSettings)
        {
            
        }


        [HttpPost]
        [Route("Find")]
        public async Task<ActionResult> GetRenewals([FromBody] Models.FindModel criteria)
        {            
            var data = new GetMultipleRenewals.Request { Criteria = criteria };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
            else
            {
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("summary")]
        public async Task<ActionResult> Getsummary([FromQuery] string days)
        {
            var data = new GetRenewalsSummary.Request { Criteria = days };
            var response = await Mediator.Send(data).ConfigureAwait(false);
            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
            else
            {
                return Ok(response);
            }
        }
    }
}
