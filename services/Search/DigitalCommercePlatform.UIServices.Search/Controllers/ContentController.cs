//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.Content;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Search.Models.Content;
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
    public class ContentController : BaseUIServiceController
    {
        private readonly IContext _context;

        public ContentController(
            IMediator mediator,
            ILogger<ContentController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("KeywordSearch")]
        public async Task<ActionResult> KeywordSearch([FromQuery] string keyword)
        {
            var request = new FullSearchRequestModel { Keyword = keyword };
            var response = await Mediator.Send(new FullSearch.Request(request)).ConfigureAwait(false);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("FullSearch")]
        public async Task<ActionResult> FullSearch(FullSearchRequestModel contentSearch)
        {
            var response = await Mediator.Send(new FullSearch.Request(contentSearch)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}