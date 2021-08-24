//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

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
        public QuoteController(
            IMediator mediator,
            IAppSettings appSettings,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> Create([FromBody] CreateQuoteModel create)
        {
            var response = await Mediator.Send(new CreateQuote.Request(create)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpPost]
        [Route("createFrom")]
        public async Task<ActionResult> CreateFrom([FromBody] CreateModelFrom createFrom)
        {
            if (Context.Site != "US") { return BadRequest("The header parameter Site must be equal to 'US'"); }
            var response = await Mediator.Send(new CreateQuoteFrom.Request(createFrom)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("preview")]
        public async Task<ActionResult> GetQuotePreview([FromQuery]string id,bool isEstimateId,string vendor)
        {
            var response = await Mediator.Send(new GetQuotePreviewDetails.Request(id,isEstimateId,vendor)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpPost]
        [Route("update")]
        public async Task<IActionResult> Update([FromBody] UpdateModel quoteToUpdate)
        {
            var response = await Mediator.Send(new UpdateQuote.Request(quoteToUpdate)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("details")]
        public async Task<IActionResult> GetQuoteDetails([FromQuery] IReadOnlyCollection<string> id, [FromQuery] bool details = true)
        {
            var response = await Mediator.Send(new GetQuote.Request(id, details)).ConfigureAwait(false);
            return Ok(response);
        }

        //[HttpGet]
        //[Route("")]
        //public async Task<IActionResult> FindQuoteDetails([FromQuery] FindModel query)
        //{
        //    var response = await Mediator.Send(new FindQuotes.Request(query)).ConfigureAwait(false);
        //        return Ok(response);
        //}

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetRecentQuotes([FromQuery] GetQuotesForGrid.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("downloadQuoteDetails")]
        public async Task<ActionResult> DownloadQuoteDetails([FromQuery] string quoteId)
        {
            var response = await Mediator.Send(new DownloadQuoteDetails.Request(quoteId)).ConfigureAwait(false);
            if (response?.Content?.BinaryContent == null) { return new NotFoundResult(); }
            return new FileContentResult(response.Content.BinaryContent, response.Content.MimeType);
        }
    }
}
