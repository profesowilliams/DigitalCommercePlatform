//2021 (c) Tech Data Corporation - All Rights Reserved.
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.Infrastructure.Filters;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Security.BasicAuthorizationHelper;

namespace DigitalCommercePlatform.UIServices.Order.Controllers
{
    [ExcludeFromCodeCoverage]
    //[SetContextFromHeader]
    [ApiController]
    [BasicAuth]
    [Authorize(AuthenticationSchemes = "NuanceAuth")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseUIServiceController
    {

        public OrderController(IMediator mediator, 
            ILogger<BaseUIServiceController> logger, 
            IUIContext context, IAppSettings appSettings, 
            ISiteSettings siteSettings) : base(mediator, logger, context, appSettings, siteSettings)
        {

        }
        [HttpPost]
        [Route("GetOrder")]
        public async Task<IActionResult> GetOrder([FromBody] NuanceWebChatRequest request)
        {
            var response = await Mediator.Send(new GetOrder.Request{WbChatRequest = request}).ConfigureAwait(false);
            if (response == null)
                return NotFound();
            return Ok(response);
        }
    }
}
