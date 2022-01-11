//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Actions.Profile;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [SetContextFromHeader]
    [Route("/v{apiVersion}/[controller]")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class ProfileController : BaseUIServiceController
    {
        public ProfileController(
            IMediator mediator,
            ILogger<RedirectController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<SearchProfileModel>> GetProfile()
        {
            var profileId = new SearchProfileId(Context.User?.ID, Context.User?.ActiveCustomer?.CustomerNumber);

            var data = await Mediator.Send(new Get.Request(profileId)).ConfigureAwait(false);

            return Ok(data);
        }

        [HttpPost]
        [Route("")]
        public async Task<ActionResult> SaveProfile(SearchProfileModel searchProfileModel)
        {
            var profileId = new SearchProfileId(Context.User?.ID, Context.User?.ActiveCustomer?.CustomerNumber);

            await Mediator.Publish(new Save.Request(profileId, searchProfileModel)).ConfigureAwait(false);

            return Ok();
        }
    }
}