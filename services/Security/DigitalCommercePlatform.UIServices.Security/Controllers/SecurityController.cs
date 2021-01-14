using DigitalCommercePlatform.UIServices.Security.AppServices;
using DigitalCommercePlatform.UIServices.Security.Requests;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Controllers
{
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class SecurityController : BaseUIServiceController
    {
        public SecurityController(IMediator mediator, IOptions<AppSettings> options, ILogger<BaseUIServiceController> loggerFactory,
                                  IContext context,ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        [HttpGet]
        [Route("GetUser")]
        public async Task<IActionResult> GetUserAsync(UserAndTokenRequest userAndTokenRequest)
        {
            var userAndTokenResponse = await Mediator.Send(new GetUserQuery(userAndTokenRequest?.ApplicationName, userAndTokenRequest?.SessionId)).ConfigureAwait(false);
            return StatusCode((int)userAndTokenResponse.HttpStatusCode, userAndTokenResponse);
        }



















        [HttpPost]
        [Route("signin")]
        public async Task<IActionResult> GetTokenAsync([FromBody]GetTokenRequest getTokenRequest)
        {
            var tokenResponse = await _mediator.Send(new LoginCommand("","")).ConfigureAwait(false);
            return Ok(tokenResponse);
        }
    }
}