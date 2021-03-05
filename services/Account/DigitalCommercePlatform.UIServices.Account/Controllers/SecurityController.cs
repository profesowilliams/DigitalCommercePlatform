using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.ValidateUser;
using DigitalCommercePlatform.UIServices.Account.Models;
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

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class SecurityController : BaseUIServiceController
    {
        public SecurityController(IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        [HttpGet]
        [Route("getUser")]
        public async Task<IActionResult> GetUserAsync(string applicationName, string sessionId)
        {
            var response = await Mediator.Send(new GetUser.Request(applicationName, sessionId)).ConfigureAwait(false);

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

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Authenticate([FromBody] Authenticate request)
        {
            var data = new AuthenticateUser.Request { Criteria = request };
            var response = await Mediator.Send(data).ConfigureAwait(false);

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