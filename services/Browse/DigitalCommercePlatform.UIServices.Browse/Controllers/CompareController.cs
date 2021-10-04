//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class CompareController : BaseUIServiceController
    {
        public CompareController(
            IMediator mediator,
            ILogger<BrowseController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [HttpGet("")]
        public async Task<ActionResult> Get([FromQuery] string[] ids)
        {
            var activeCustomerSalesOrgs = Context?.User?.ActiveCustomer?.SalesDivision?.Select(x => x.SalesOrg);
            var activeCustomeruserSystem = Context?.User?.ActiveCustomer?.System;

            var salesOrg = SalesOrg.FirstOrDefault(x => x.System == activeCustomeruserSystem && (activeCustomerSalesOrgs?.Contains(x.Value) ?? false));

            if (activeCustomerSalesOrgs == null || !activeCustomerSalesOrgs.Any() || activeCustomeruserSystem == null || salesOrg == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Active customer without salesorg and system");
            }
            var request = new GetProductsCompare.Request { Ids = ids, SalesOrg = salesOrg.Value, Site = Context?.Site };

            var data = await Mediator.Send(request).ConfigureAwait(false);

            return Ok(data);
        }
    }
}