using MediatR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.Http.Controller;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfSavedCartsQuote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Authorization;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;

namespace DigitalCommercePlatform.UIServices.Commerce.Controllers
{
    [ExcludeFromCodeCoverage]
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}/quote")]
    public class QuoteController : BaseUIServiceController
    {
        public QuoteController(IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }


        [HttpGet]
        [Route("")]
        public IActionResult GetQuote(string quoteId)
        {
            var response = "Quote Id : " + quoteId;
            return Ok(response);
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] CreateModel create)
        {
            var response = await Mediator.Send(new CreateQuote.Request(create)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpPost]
        [Route("createFrom")]
        public async Task<ActionResult> CreateFrom([FromBody] CreateModelFrom createFrom)
        {
            var response = await Mediator.Send(new CreateQuoteFrom.Request(createFrom)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("create/{savedCartId}")]
        public async Task<ActionResult> GetCartDetailsInQuote(string cartId)
        {
            var response = await Mediator.Send(new Request(cartId)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("get")]
        public async Task<IActionResult> GetQuoteDetails([FromQuery] IReadOnlyCollection<string> id,[FromQuery] bool details = true)
        {
            var response = await Mediator.Send(new GetQuote.Request(id, details)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("find")]
        public async Task<IActionResult> FindQuoteDetails([FromQuery] FindModel query)
        {
            var response = await Mediator.Send(new FindQuotes.Request(query)).ConfigureAwait(false);
                return Ok(response);
        }

        [HttpGet]
        [Route("getQuotesForGrid")]
        public async Task<IActionResult> GetQuotesForGrid([FromQuery] GetQuotesForGrid.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }
    }
}
