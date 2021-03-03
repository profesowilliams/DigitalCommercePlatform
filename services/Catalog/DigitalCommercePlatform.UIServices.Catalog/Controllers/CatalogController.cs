using DigitalCommercePlatform.UIService.Catalog.Actions;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Catalog.Controllers
{
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class CatalogController : BaseUIServiceController
    {
        public CatalogController(
            IMediator mediator,
            ILogger<CatalogController> logger,
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