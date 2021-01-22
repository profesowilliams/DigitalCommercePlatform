using DigitalCommercePlatform.UIServices.Quote.Actions.Quote;
using DigitalFoundation.AppServices.Quote.Models;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class QuoteController : BaseUIServiceController
    {
        //private readonly ILogger<QuoteController> _logger;

        public QuoteController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            IOptions<AppSettings> options,
            ISiteSettings siteSettings,
            IHttpClientFactory httpClientFactory

            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {

        }

        /// <summary>
        /// QuoteController Get by Id
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> Get(string id, [FromQuery] bool details = true)
        {
            var response = await Mediator.Send(new GetQuoteHandler.Request(id, details, Context.AccessToken)).ConfigureAwait(false);

            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
            else
            {
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetByIds(
            [FromQuery(Name = "id")] List<string> ids, bool details = true)
        {
            var response = await Mediator.Send(new GetQuotesHandler.Request(ids, details)).ConfigureAwait(false);

            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }
            else
            {
                return Ok(response);
            }


        }

        [HttpGet]
        [Route("Find")]
        public async Task<IActionResult> Search([FromQuery] FindModel search)
        {
            var response = await Mediator.Send(new SearchQuoteHandler.Request(search)).ConfigureAwait(false);

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
