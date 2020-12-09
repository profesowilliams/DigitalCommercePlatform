using DigitalCommercePlatform.UIServices.Security.DTO.Request;
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
        [Route("validate/{applicationName}")]
        public async Task<IActionResult> ValidateUser(ValidateUserRequest validateUserRequest)
        {
            var validateUserResponse = await _mediator.Send(validateUserRequest).ConfigureAwait(false);
            return StatusCode((int)validateUserResponse.HttpStatusCode, validateUserResponse);
        }
    }
}