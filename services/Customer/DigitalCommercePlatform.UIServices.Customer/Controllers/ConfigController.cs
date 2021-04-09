using DigitalCommercePlatform.UIServices.Customer.Actions;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}/{controller}")]
    //[Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class ConfigController : BaseUIServiceController
    {
        public ConfigController(
            IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings
            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<ConfigGet.Response>> Get()
        {
            var request = new ConfigGet.Request(Context.AccessToken);
            var response = await Mediator.Send(request);
            return Ok(response);
        }
    }
}
