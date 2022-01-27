//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Actions.Order;
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Filters;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Controllers
{
    [ExcludeFromCodeCoverage]
    [SetContextFromHeader]
    [ApiController]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("/v{api0Version}")]
    public class ExportController : BaseUIServiceController
    {
        public ExportController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, appSettings, siteSettings)
        {
        }

        [HttpPost]
        [Route("downloadQuoteDetails")]
        public async Task<ActionResult> DownloadQuoteDetails(DownloadQuoteDetails.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            if (response?.Content?.BinaryContent == null) 
                return new NotFoundResult(); 
            return new FileContentResult(response.Content.BinaryContent, response.Content.MimeType);
        }

        [HttpPost]
        [Route("downloadRenewalQuoteDetails")]
        public async Task<ActionResult> DownloadRenewalQuoteDetails(DownloadRenewalQuoteDetails.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            if (response?.Content?.BinaryContent == null)
                return new NotFoundResult();
            return new FileContentResult(response.Content.BinaryContent, response.Content.MimeType);
        }

        [HttpPost]
        [Route("downloadOrderDetails")]
        public async Task<ActionResult> DownloadOrderDetails(DownloadOrderDetails.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            if (response?.Content?.BinaryContent == null)
                return new NotFoundResult();
            return new FileContentResult(response.Content.BinaryContent, response.Content.MimeType);
        }
    }
}
