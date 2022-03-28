//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Actions.RegisterCustomer;
using DigitalCommercePlatform.UIServices.Account.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    [SetContextFromHeader]
    public class CustomerController : BaseUIServiceController
    {
        public CustomerController(IMediator mediator,
            IAppSettings appSettings,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpPost]
        [Route("RegisterCustomer")]
        public async Task<IActionResult> RegisterCustomerAsync([FromBody, NotNull] RegisterCustomerRequestModel request)
        {
            var response = await Mediator.Send(new RegisterCustomer.Request(request)).ConfigureAwait(false);

            if (response.Error.IsError)
            {
                return StatusCode(response.Error.Code, response);
            }

            return Ok(response);
        }
    }
}