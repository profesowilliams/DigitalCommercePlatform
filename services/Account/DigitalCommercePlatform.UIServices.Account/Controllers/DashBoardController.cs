using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.CustomerAddress;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.GetConfigurationsFor;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopDeals;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    [ExcludeFromCodeCoverage]
    public class DashBoardController : BaseUIServiceController
    {
        public DashBoardController(IMediator mediator,
            IAppSettings appSettings,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("configurationsSummary")]
        public async Task<IActionResult> GetConfigurationsSummary([FromQuery] string criteria)
        {
            GetConfigurationsSummary.Request request = new GetConfigurationsSummary.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("dealsSummary")]
        public async Task<IActionResult> GetDealsSummary([FromQuery] string days)
        {
            GetDealsSummary.Request request = new GetDealsSummary.Request { Days = days };
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("actionItems")]
        public async Task<IActionResult> GetActionItems([FromQuery] string days)
        {
            GetActionItems.Request request = new GetActionItems.Request { Days = days };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("topQuotes")]
        public async Task<IActionResult> GetTopQuotes([FromQuery] int top,string sortby,string sortDirection)
        {
            var request = new GetTopQuotes.Request { Top = top,Sortby=sortby,SortDirection=sortDirection };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("topConfigurations")]
        public async Task<IActionResult> GetTopConfigurations([FromQuery] int top)
        {
            var request = new GetTopConfigurations.Request { Top = top };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("topDeals")]
        public async Task<IActionResult> GetTopDeals([FromQuery] int top)
        {
            var request = new GetTopDeals.Request { Top = top };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("savedCarts")]
        public async Task<IActionResult> GetSavedCartList([FromQuery] bool getAll, int maximumSavedCarts)
        {
            var response = await Mediator.Send(new GetCartsList.Request(getAll, maximumSavedCarts)).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("configurations")]
        public async Task<IActionResult> GetConfigurationsFor([FromQuery] bool getAll, int maximumItems, GetConfigurationsFor.RequestType requestType)
        {
            var response = await Mediator.Send(new GetConfigurationsFor.Request(requestType, getAll, maximumItems)).ConfigureAwait(false);
            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("renewals")]
        public async Task<IActionResult> GetRenewals()
        {
            var customerNumber = Context.User.ActiveCustomer?.CustomerNumber;
            // Current requirement is if system is 2 to take the 0100 as sales org
            var salesOrg = Context.User.ActiveCustomer?.System == "2" ? "0100" : string.Empty;

            var renewalsSummaryRequest = new GetRenewalsSummary.Request
            {
                CustomerNumber = customerNumber,
                SalesOrganization = salesOrg,    
                Days = 30                         // in future this will be from param - ([FromQuery] int days)
            };

            var response = await Mediator.Send(renewalsSummaryRequest).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("myQuotes")]
        public async Task<IActionResult> GetMyQuote([FromQuery] string criteria)
        {
            var request = new MyQuoteDashboard.Request { Criteria = criteria };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("myOrders")]
        public async Task<IActionResult> GetMyOrder([FromQuery] bool isMonthly)
        {
            var request = new GetMyOrders.Request { IsMonthly = isMonthly };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }

        [HttpGet]
        [Route("getAddress")]
        public async Task<IActionResult> GetAddress([FromQuery] string criteria, bool ignoreSalesOrganization = false)
        {
            criteria = string.IsNullOrWhiteSpace(criteria) ? "ALL" : criteria.ToUpper();

            GetAddress.Request request = new GetAddress.Request
            {
                Criteria = criteria,
                IgnoreSalesOrganization = ignoreSalesOrganization
            };
            var response = await Mediator.Send(request).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(StatusCodes.Status400BadRequest, response);
            }

            return Ok(response);
        }
    }
}