//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;

namespace DigitalCommercePlatform.UIServices.Renewal.Controllers
{
    [ExcludeFromCodeCoverage]
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{api0Version}")]
    public class RenewalController : BaseUIServiceController
    {
        public RenewalController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("Search")]
        public async Task<IActionResult> SearchRenewals([FromQuery] SearchModel model)
        {
            if (model.Details)
            {
                var response = await Mediator.Send(new SearchRenewalDetailed.Request()).ConfigureAwait(false);
                if (response == null)
                    return NotFound();
                return Ok(response);
            }
            else
            {
                var response = await Mediator.Send(new SearchRenewalSummary.Request()).ConfigureAwait(false);
                if (response == null)
                    return NotFound();
                return Ok(response);
            }
        }
        [HttpGet]
        [Route("test")]
        public string Test(string request)
        {
            return "your reqset : " + request;
        }

        [HttpGet]
        [Route("renewals")]
        public async Task<IActionResult> FindRenewals([FromQuery] int pageSize) // Fix this 
        {
            var response = await Mediator.Send(new GetRenewal.Request(pageSize)).ConfigureAwait(false); // Fix This
            return Ok(response);
        }
    }
}
