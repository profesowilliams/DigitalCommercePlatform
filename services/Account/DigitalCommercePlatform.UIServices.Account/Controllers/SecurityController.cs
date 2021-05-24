using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalCommercePlatform.UIServices.Account.Actions.Logout;
using DigitalCommercePlatform.UIServices.Account.Actions.UserActiveCustomer;
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
            IAppSettings appSettings,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("GetUser/{applicationName}")]
        public async Task<IActionResult> GetUserAsync([FromRoute] string applicationName)
        {
            var response = await Mediator.Send(new GetUser.Request(applicationName)).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(response.Error.Code, response);
            }

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Authenticate(AuthenticateBodyRequest authenticateBodyRequest, [FromHeader] AuthenticateHeaderRequest authenticateHeaderRequest)
        {
            var authenticateUserRequest = new AuthenticateUser.Request
            {
                ApplicationName = authenticateBodyRequest?.ApplicationName,
                Code = authenticateBodyRequest?.Code,
                Consumer = authenticateHeaderRequest?.Consumer,
                Language = authenticateHeaderRequest?.Language,
                RedirectUri = authenticateBodyRequest?.RedirectUri,
                SessionId = authenticateHeaderRequest?.SessionId,
                TraceId = authenticateHeaderRequest?.TraceId
            };

            var response = await Mediator.Send(authenticateUserRequest);

            if (response.Error.IsError)
            {
                return StatusCode(response.Error.Code, response);
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("logout")]
        public async Task<IActionResult> Logout([FromHeader] string sessionId)
        {
            var response = await Mediator.Send(new LogoutUser.Request(sessionId));

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpPost]
        [Route("activeCustomer")]
        public async Task<IActionResult> ActiveCustomer(ActiveCustomerRequest activeCustomerRequest)
        {
            var response = await Mediator.Send(new ActiveCustomer.Request
            {
                CompanyNumber = activeCustomerRequest.CompanyNumber,
                CompanyName = activeCustomerRequest.CompanyName
            });

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }
    }
}