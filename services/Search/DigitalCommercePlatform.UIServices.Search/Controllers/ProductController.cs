//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.ActionResults;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Providers.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [SetContextFromHeader]
    [Route("/v{apiVersion}/[controller]")]
    [Authorize(AuthenticationSchemes = "SessionIdHeaderScheme")]
    public class ProductController : BaseUIServiceController
    {
        private readonly IContext _context;

        public ProductController(
            IMediator mediator,
            ILogger<ProductController> logger,
            IUIContext context,
            IAppSettings appSettings,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, appSettings, siteSettings)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("FullSearch")]
        public async Task<ActionResult> FullSearch(FullSearchRequestModel productSearch)
        {
            var response = await Mediator.Send(new FullSearch.Request(_context.User == null, productSearch)).ConfigureAwait(false);
            return Ok(response.Results);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("KeywordSearch")]
        public async Task<ActionResult> KeywordSearch(string keyword, string categoryId)
        {
            var response = await Mediator.Send(new KeywordSearch.Request(_context.User == null, keyword, categoryId)).ConfigureAwait(false);
            return Ok(response.Results);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("GetAdvancedRefinements")]
        public async Task<ActionResult> GetAdvancedRefinements(FullSearchRequestModel productSearch)
        {
            var response = await Mediator.Send(new GetAdvancedRefinements.Request(productSearch)).ConfigureAwait(false);
            return Ok(response.Results);
        }

        [HttpPost]
        [Route("Export")]
        public async Task<IActionResult> Export(ExportRequestModel request)
        {
            var data = await Mediator.Send(new ExportSearch.Request { Data = request }).ConfigureAwait(false);

            if (data == null || !data.Any())
            {
                return NotFound();
            }

            return request.ExportFormat switch
            {
                ExportFormatEnum.csv => new CsvActionResult<ExportResponseModel>(data, "SearchResults"),
                _ => Ok(data),
            };
        }
    }
}