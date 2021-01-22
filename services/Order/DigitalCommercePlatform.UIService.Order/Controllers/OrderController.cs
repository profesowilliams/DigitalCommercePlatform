using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofMultipleOrder;
using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofOrder;
using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailstoFindOrder;
using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Order.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseUIServiceController
    {
        
        public OrderController(
            IMediator mediator,
            ILogger<OrderController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("id")]
        public async Task<SalesOrderModel> GetAsync(string id)
        {
            var response = await Mediator.Send(new GetOrder.Request { Id = id }).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("")]
        public async Task<IEnumerable<SalesOrderModel>> GetMultiple([FromQuery(Name = "id")] List<string> id)
        {
            var response = await Mediator.Send(new GetMultipleOrders.Request()
            {
                Id = id
            }).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("Find")]
        public async Task<IActionResult> SearchAsync([FromQuery] FindRequestModel search)
        {
            if (ObjectExtensions.PassThrowNonNull(search).Details)
            {
                var findResponse = await Mediator.Send(new FindOrder.Request { SearchQuery = search }).ConfigureAwait(false);

                if (findResponse?.Data?.Any() != true)
                    return NotFound();
                else
                    return Ok(findResponse);
            }
            else
            {
                var findSummaryResponse = await Mediator.Send(new FindSummaryOrder.Request { SearchQuery = search }).ConfigureAwait(false);

                if (findSummaryResponse?.Data?.Any() != true)
                    return NotFound();
                else
                    return Ok(findSummaryResponse);
            }
        }
    }
}