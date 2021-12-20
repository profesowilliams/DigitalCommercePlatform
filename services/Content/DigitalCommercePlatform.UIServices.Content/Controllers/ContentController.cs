//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Content.Actions;
using DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Content.Actions.CreateCartByQuote;
using DigitalCommercePlatform.UIServices.Content.Actions.ReplaceCartQuotes;
using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
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
        /// <summary>
        /// Create Quote with QuoteId
        /// </summary>
        /// <param name="QuoteId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("CreateByQuote")]
        public async Task<IActionResult> CreateByQuote([FromQuery] string QuoteId)
        {
            var response = await Mediator.Send(new GetCreateCartByQuote.Request(QuoteId)).ConfigureAwait(false);
            return Ok(response);
        }
        /// <summary>
        /// Check Out for Quotes Grid
        /// </summary>
        /// <param name="id"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("replaceCart")]
        public async Task<ActionResult> ReplaceCart([FromQuery] string id, string type = "quote")
        {
            var response = await Mediator.Send(new ReplaceCart.Request(id,type)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
