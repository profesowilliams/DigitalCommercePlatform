//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Filters;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Controllers
{
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

        [HttpGet]
        [Route("downloadQuoteDetails")]
        public async Task<ActionResult> DownloadQuoteDetails(DownloadQuoteDetails.Request request)
        {
            var response = await Mediator.Send(request).ConfigureAwait(false);
            if (response?.Content?.BinaryContent == null) 
                return new NotFoundResult(); 
            return new FileContentResult(response.Content.BinaryContent, response.Content.MimeType);
        }

        [HttpGet]
        [Route("test")]
        public ActionResult<string> TestMethod(string testparam)
        {
            return "test ok " + testparam;
        }
    }
}
