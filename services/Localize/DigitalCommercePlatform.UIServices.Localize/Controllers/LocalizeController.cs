//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Localize.Actions;
using DigitalCommercePlatform.UIServices.Localize.Infrastructure.Filters;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Localize.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [SetContextFromHeader]
    [Route("/v{apiVersion}")]
    public class LocalizeController : BaseUIServiceController
    {
        public LocalizeController(
            IMediator mediator,
            ILogger<LocalizeController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("")]
        public async Task<Dictionary<string, Dictionary<string, string>>> GetLocalizations(string[] id)
        {
            return await Mediator.Send(new GetLocalizations.Request(id)).ConfigureAwait(false);
        }
    }
}