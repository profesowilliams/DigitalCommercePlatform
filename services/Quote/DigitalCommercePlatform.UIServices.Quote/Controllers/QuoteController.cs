using DigitalCommercePlatform.UIServices.Quote.Actions.Quote;
using DigitalFoundation.App.Services.Quote.Models;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    //[ApiController] // This line is commented to make the /health endpoint work
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
            var response = await Mediator.Send(new GetQuotesHandler.Request(ids, details, Context.AccessToken)).ConfigureAwait(false);

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
            var response = await Mediator.Send(new SearchQuoteHandler.Request(search, Context.AccessToken)).ConfigureAwait(false);

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
        [Route("GetTdQuotesForGrid")]
        public async Task<IActionResult> GetTdQuotesForGrid(string createdBy, string sortBy, bool sortAscending)
        {
            var response = await Mediator.Send(new GetTdQuotesForGridHandler.Request(Context.AccessToken, createdBy, sortBy, sortAscending)).ConfigureAwait(false);

            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            if (response.IsError)
            {
                return StatusCode(response.ErrorCode == "unauthorized"
                    ? StatusCodes.Status401Unauthorized
                    : StatusCodes.Status500InternalServerError);
            }
            return Ok(response.Content);
        }

        [HttpGet]
        [Route("GetDealsForGrid")]
        public async Task<IActionResult> GetDealsForGrid(string creator)
        {
            var response = await Mediator.Send(new GetDealsForGridRequest(creator, Context.AccessToken)).ConfigureAwait(false);

            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            if (response.IsError)
            {
                return StatusCode(response.ErrorCode == "unauthorized"
                    ? StatusCodes.Status401Unauthorized
                    : StatusCodes.Status500InternalServerError);
            }
            dynamic result = JObject.Parse(response.Content);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetConfigsForGrid")]
        public async Task<IActionResult> GetConfigsForGrid(string creator)
        {
            var response = await Mediator.Send(new GetConfigsForGridRequest(creator, Context.AccessToken)).ConfigureAwait(false);

            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            if (response.IsError)
            {
                return StatusCode(response.ErrorCode == "unauthorized"
                    ? StatusCodes.Status401Unauthorized
                    : StatusCodes.Status500InternalServerError);
            }
            dynamic result = JObject.Parse(response.Content);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetRenewalsForGrid")]
        public async Task<IActionResult> GetRenewalsForGrid(string creator)
        {
            var response = await Mediator.Send(new GetRenewalsForGridRequest(creator, Context.AccessToken)).ConfigureAwait(false);

            if (response.IsError && response.ErrorCode == "possible_invalid_code")
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            if (response.IsError)
            {
                return StatusCode(response.ErrorCode == "unauthorized"
                    ? StatusCodes.Status401Unauthorized
                    : StatusCodes.Status500InternalServerError);
            }
            dynamic result = JObject.Parse(response.Content);
            return Ok(result);
        }
    }
}
