//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions;
using DigitalCommercePlatform.UIServices.Search.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Search.Actions.CreateCartByQuote;
using DigitalCommercePlatform.UIServices.Search.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Search.Models.Cart;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Controllers
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
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
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
        public async Task<ActionResult> TypeAheadSearch([FromQuery] string searchTerm, int? maxResults, string Type)
        {
            var response = await Mediator.Send(new TypeAheadSearch.Request(searchTerm, maxResults, Type)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("activeCart")]
        public async Task<ActionResult<GetSavedCartDetails.Response>> GetActiveCartDetails()
        {
            var response = await Mediator.Send(new GetActiveCart.Request()).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpPatch]
        [Route("addItems")]
        public async Task<IActionResult> AddItemsToCart([FromBody] List<CartItemModel> itemModels)
        {
            var response = await Mediator.Send(new AddCartItem.Request(itemModels)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("CreateByQuote")]
        public async Task<IActionResult> CreateByQuote([FromQuery] string QuoteId)
        {
            var response = await Mediator.Send(new GetCreateCartByQuote.Request(QuoteId)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
