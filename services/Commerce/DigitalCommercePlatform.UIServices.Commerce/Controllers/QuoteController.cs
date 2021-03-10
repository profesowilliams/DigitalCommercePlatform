using MediatR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.Http.Controller;
using static DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute.DetailsOfOrderQuote;

namespace DigitalCommercePlatform.UIServices.Commerce.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class QuoteController : BaseUIServiceController
    {
        public QuoteController(IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        [HttpGet]
        [Route("quote")]
        public IActionResult GetQuote(string quoteId)
        {
            var response = "Quote Id : " + quoteId;
            return Ok(response);
        }

        [HttpGet]
        [Route("getOrderDetailsInQuote")]
        public async Task<ActionResult<Response>> GetOrderDetailsInQuoteAsync(string userId,string productId)
        {
            var response = await Mediator.Send(new Request(userId, productId)).ConfigureAwait(false);
            return response;
        }
    }
}
