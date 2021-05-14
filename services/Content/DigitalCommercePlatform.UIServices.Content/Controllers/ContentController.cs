using DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [SetContextFromHeader]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class ContentController : BaseUIServiceController
    {
        public ContentController(
            IMediator mediator,
            ILogger<ContentController> logger,
            IUIContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }
        [HttpGet]
        [Route("savedCart")]
        public async Task<ActionResult<GetSavedCartDetails.Response>> GetSavedCartDetails(string id, bool isCartName)
        {
            var response = await Mediator.Send(new GetSavedCartDetails.Request(id, isCartName)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("Search")]
        public async Task<ActionResult<TypeAheadSearch.Response>> TypeAheadSearch(string searchTerm,  int? maxResults)
        {
            var response = await Mediator.Send(new TypeAheadSearch.Request(searchTerm, maxResults)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("activeCart")]
        public async Task<ActionResult<GetSavedCartDetails.Response>> GetActiveCartDetails()
        {
            var response = await Mediator.Send(new GetActiveCart.Request()).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
