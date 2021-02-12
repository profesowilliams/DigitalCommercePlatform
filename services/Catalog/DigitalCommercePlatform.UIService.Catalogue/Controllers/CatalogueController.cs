using DigitalCommercePlatform.UIService.Catalogue.Actions.Catalogue;
using DigitalCommercePlatform.UIService.Catalogue.Models;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Catalogue.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class CatalogueController : BaseUIServiceController
    {
        public CatalogueController(
            IMediator mediator,
            ILogger<CatalogueController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, settings, siteSettings)
        {
        }

        [HttpGet]
        [Route("id")]
        public async Task<GetMultipleCatalogHierarchy.Response> GetMultiple([FromQuery(Name = "id")] string[] ids)
        {
            return await Mediator.Send(new GetMultipleCatalogHierarchy.Request { Id = ids }).ConfigureAwait(false);
        }
    }
}