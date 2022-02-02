//2021 (c) Tech Data Corporation - All Rights Reserved.
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Security.BasicAuthorizationHelper;
using DigitalFoundation.Common.Services.Base;

namespace DigitalCommercePlatform.UIServices.Order.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiController]
    [BasicAuth]
    [Authorize(AuthenticationSchemes = "NuanceAuth")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class OrderController : BaseController /*BaseUIServiceController*/
    {

        public OrderController(IMediator mediator, 
            ILogger<BaseUIServiceController> logger) : base(mediator, logger)
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
