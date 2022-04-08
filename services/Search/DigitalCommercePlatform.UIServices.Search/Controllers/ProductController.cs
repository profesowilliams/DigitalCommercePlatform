//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.ActionResults;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.Filters;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
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

        private bool IsLoggedIn => Context.User is not null;

        [AllowAnonymous]
        [HttpPost]
        [Route("FullSearch")]
        public async Task<ActionResult<FullSearchResponseModel>> FullSearch(FullSearchRequestModel productSearch)
        {
            var response = await Mediator.Send(new FullSearch.Request(!IsLoggedIn, productSearch, new(_context.User?.ActiveCustomer?.CustomerNumber, _context.User?.ID), Context.Language)).ConfigureAwait(false);
            response.Results.IsLoggedIn = IsLoggedIn;
            return Ok(response.Results);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("KeywordSearch")]
        public async Task<ActionResult<FullSearchResponseModel>> KeywordSearch(string keyword, string categoryId)
        {
            var response = await Mediator.Send(new KeywordSearch.Request(!IsLoggedIn, keyword, categoryId, new(_context.User?.ActiveCustomer?.CustomerNumber, _context.User?.ID), Context.Language)).ConfigureAwait(false);
            response.Results.IsLoggedIn = IsLoggedIn;
            return Ok(response.Results);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("GetAdvancedRefinements")]
        public async Task<ActionResult<IEnumerable<RefinementGroupResponseModel>>> GetAdvancedRefinements(FullSearchRequestModel productSearch)
        {
            var response = await Mediator.Send(new GetAdvancedRefinements.Request(!IsLoggedIn, productSearch)).ConfigureAwait(false);
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

            Response.Headers.Add("X-MaximumResults", data.First().MaximumResults ? "true" : "false");
            Response.Headers.Add("X-Count", data.Count().ToString());
            return request.ExportFormat switch
            {
                ExportFormatEnum.csv => new CsvActionResult<ExportResponseModel>(data, "SearchResults"),
                _ => Ok(data),
            };
        }
    }
}