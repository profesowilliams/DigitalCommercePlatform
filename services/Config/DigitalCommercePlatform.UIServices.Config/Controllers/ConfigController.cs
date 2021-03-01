
using DigitalCommercePlatform.UIServices.Config.Actions.GetConfigurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configuration;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Controllers
{
    public class ConfigController : BaseUIServiceController
    {
        public ConfigController(IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }
        [HttpPost]
        [Route("Find")]
        public async Task<ActionResult> GetConfigurations([FromBody] FindModel criteria)
        {
            var data = new GetConfigurations.Request { Criteria = criteria };
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
