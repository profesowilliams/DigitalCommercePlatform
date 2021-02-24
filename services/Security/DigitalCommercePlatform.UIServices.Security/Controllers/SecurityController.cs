using DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken;
using DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Controllers
{
    [ExcludeFromCodeCoverage]
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
        [Route("GetUser/{applicationName}")]
        public async Task<IActionResult> GetUserAsync(GetUserRequest getUserRequest)
        {
            var response = await Mediator.Send(new GetUserQuery(getUserRequest?.ApplicationName, getUserRequest?.SessionId));

            // this is a dummy service for now
            //if (response.IsError && response.ErrorCode == "forbidden")
            //{
            //    return StatusCode(StatusCodes.Status403Forbidden, response);
            //}

            //if (response.IsError)
            //{
            //    return StatusCode(StatusCodes.Status401Unauthorized, response);
            //}

            return Ok(response);
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> GetTokenAsync([FromBody] GetTokenRequest getTokenRequest)
        {
            var response = await Mediator.Send(new GetTokenQuery(getTokenRequest?.Code, getTokenRequest?.RedirectUri,getTokenRequest?.SessionId,getTokenRequest?.WithUserData));

            //if (response.IsError && response.ErrorCode == "possible_invalid_code")
            //{
            //    return StatusCode(StatusCodes.Status400BadRequest, response);
            //}

            //if (response.IsError)
            //{
            //    return StatusCode(response.ErrorCode == "unauthorized"
            //        ? StatusCodes.Status401Unauthorized
            //        : StatusCodes.Status500InternalServerError);
            //}

            

            return Ok(response);
        }
    }
}