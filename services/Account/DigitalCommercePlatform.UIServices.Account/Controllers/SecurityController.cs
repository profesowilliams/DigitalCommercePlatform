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
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
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
        [Route("GetUser/{applicationName}")]
        public async Task<IActionResult> GetUserAsync([FromRoute] string applicationName)
        {
            var response = await Mediator.Send(new GetUser.Request(applicationName)).ConfigureAwait(false);

            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Authenticate(AuthenticateBodyRequest authenticateBodyRequest, [FromHeader] AuthenticateHeaderRequest authenticateHeaderRequest)
        {
            var response = await Mediator.Send(new AuthenticateUser.Request(authenticateBodyRequest?.Code, authenticateBodyRequest?.RedirectUri, authenticateBodyRequest?.ApplicationName,
               authenticateHeaderRequest?.TraceId, authenticateHeaderRequest?.Language, authenticateHeaderRequest?.Consumer, authenticateHeaderRequest?.SessionId));

            if (response.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            

            return Ok(response);
        }
    }
}