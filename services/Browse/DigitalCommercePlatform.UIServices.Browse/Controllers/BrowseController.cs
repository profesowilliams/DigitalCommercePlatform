using MediatR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.Http.Controller;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;


namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    
    public class BrowseController : BaseUIServiceController
    {

        public BrowseController(
            IMediator mediator,
            ILogger<BrowseController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }


        [HttpGet]
        [Route("getHeaderDetails")]
        public async Task<ActionResult<GetHeaderResponse>> GetHeader(string userId, string customerId, string catalogueCriteria)
        {
            var response = await Mediator.Send(new GetHeaderRequest(userId,customerId,catalogueCriteria)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("cartDetails")]
        public async Task<ActionResult<GetCartResponse>> GetCartDetails(string userId, string customerId)
        {
            var response = await Mediator.Send(new GetCartRequest(userId, customerId)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("catalogueDetails")]
        public async Task<ActionResult<GetCatalogueResponse>> GetCatalogue(string id)
        {
            var response = await Mediator.Send(new GetCatalogueRequest(id)).ConfigureAwait(false);
            return response;
        }

        [HttpGet]
        [Route("customerDetails")]
        public async Task<ActionResult<GetCustomerResponse>> GetCustomer(string id)
        {
            var response = await Mediator.Send(new GetCustomerRequest(id)).ConfigureAwait(false);
            return response;
        }
    }
}