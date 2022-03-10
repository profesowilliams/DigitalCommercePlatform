//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetStock;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [SetContextFromHeader]
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{version:apiVersion}/[controller]")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class StockController : BaseUIServiceController
    {
        public StockController(
           IMediator mediator,
           ILogger<StockController> logger,
           IUIContext context,
           IAppSettings appSettings,
           ISiteSettings siteSettings)
           : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [Route("details")]
        public async Task<IActionResult> GetStock([FromQuery] string id)
        {
            try
            {
                var stock = await Mediator.Send(new GetStockHandler.Request(id)).ConfigureAwait(false);

                return Ok(stock);
            }
            catch (Exception ex)
            {
                return ProcessException(ex, id);
            }
            
        }

        private IActionResult ProcessException(Exception ex, string id)
        {
            if (ex is RemoteServerHttpException)
            {
                var remoteEx = ex as RemoteServerHttpException;
                var type = remoteEx.Details?.GetType();
                var bodyMessage = remoteEx.Code == HttpStatusCode.NotFound ? $"No stock information found for product {id}"
                    : type?.GetProperty("Body")?.GetValue(remoteEx.Details);
                
                return StatusCode((int)remoteEx.Code, bodyMessage);
            }
            return StatusCode(500);
        }
    }
}