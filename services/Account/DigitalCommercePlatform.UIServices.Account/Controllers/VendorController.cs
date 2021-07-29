using DigitalCommercePlatform.UIServices.Account.Actions.ConnectToVendor;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorConnections;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorDisconnect;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorRefreshToken;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    [ExcludeFromCodeCoverage]
    public class VendorController : BaseUIServiceController
    {
        public VendorController(IMediator mediator,
            IAppSettings appSettings,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("setVendorConnection")]
        public async Task<ActionResult> SetVendorConnections(string code, string vendor, string redirectURL)
        {
            SetVendorConnection.Request request = new SetVendorConnection.Request { Code = code, Vendor= vendor, RedirectURL = redirectURL };
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("getVendorConnections")]
        public async Task<ActionResult> GetVendorConnections()
        {
            var response = await Mediator.Send(new GetVendorConnections.Request()).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("vendorRefreshToken")]
        public async Task<ActionResult> VendorRefreshToken(string Vendor)
        {
            var response = await Mediator.Send(new VendorRefreshToken.Request(Vendor)).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("vendorDisconnect")]
        public async Task<ActionResult> VendorDisconnect([FromQuery] string vendor)
        {
            GetVendorDisconnect.Request request = new GetVendorDisconnect.Request { Vendor = vendor};
            var response = await Mediator.Send(request).ConfigureAwait(false);
            return Ok(response);
        }

        [HttpGet]
        [Route("getVendorAuthorizeURL")]
        public async Task<ActionResult> VendorAuthorizeURL([FromQuery] string vendor)
        {
            var response = await Mediator.Send(new getVendorAuthorizeURL.Request(vendor)).ConfigureAwait(false);
            return Ok(response);
        }
    }
}