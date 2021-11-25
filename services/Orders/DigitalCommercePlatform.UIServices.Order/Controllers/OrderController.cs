using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Controllers
{
    [ExcludeFromCodeCoverage]
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
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
            return Ok(response);
        }
    }
}
