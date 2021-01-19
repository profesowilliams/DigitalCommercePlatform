using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Models.Search;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiVersion("1.0")]
    [Route("v{version:apiVersion}")]
    public class ProductController : BaseUIServiceController
    {
        private readonly IHttpClientFactory _httpClientFactory;
        public ProductController(
            IMediator mediator,
            ILogger<ProductController> logger,
            IContext context,
            IOptions<AppSettings> settings,
            ISiteSettings siteSettings,
            IHttpClientFactory httpClientFactory)
            : base(mediator, logger, context, settings, siteSettings)
        {
            _httpClientFactory = httpClientFactory;
        }
        
        [HttpGet]
        [Route("id")]
        public async Task<ActionResult<object>> Get( string id, [FromQuery] bool details = true)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            if (details)
            {
                var response = await _mediator.Send(new GetProductDetailMultiple.Request { Id = new List<string> { id }, Details = details }).ConfigureAwait(false);
                if (response?.ReturnObject == null || !response.ReturnObject.Any())
                    return NotFound();
                else
                    return Ok(response);
            }
            else
            {
                var response = await _mediator.Send(new GetProductSummaryMultiple.Request { Id = new List<string> { id }, Details = details }).ConfigureAwait(false);
                if (response?.ReturnObject == null || !response.ReturnObject.Any())
                    return NotFound();
                else
                    return Ok(response);
            }
            
            
        }

        [HttpGet]
        [Route("")]
        public async Task<ActionResult<object>> GetMultiple([FromQuery(Name = "id")] List<string> id, [FromQuery] bool details = true)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            if (details)
            {
                var response = await _mediator.Send(new GetProductDetailMultiple.Request { Id = id, Details = details }).ConfigureAwait(false);

                if (response?.ReturnObject == null || !response.ReturnObject.Any())
                    return NotFound();
                else
                    return Ok(response);
            }
            else
            {
                var response = await _mediator.Send(new GetProductSummaryMultiple.Request { Id = id, Details = details }).ConfigureAwait(false);

                if (response?.ReturnObject == null || !response.ReturnObject.Any())
                    return NotFound();
                else
                    return Ok(response);
            }

              
        }


        /// <summary>
        /// Find
        /// </summary>
        /// <param name="query"></param>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <param name="withPaginationInfo"></param>
        /// <param name="details"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("Find")]
        public async Task<IActionResult> Find([FromQuery] UIService.Product.Models.Find.FindProductModel query, [FromQuery] int? page, [FromQuery] int? pageSize, [FromQuery] bool withPaginationInfo, [FromQuery] bool details = true)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            if (details)
            {
                var response = await _mediator.Send(new FindProduct.Request { Query = query, WithPaginationInfo = withPaginationInfo, Page = page ?? 1, PageSize = pageSize ?? 10 }).ConfigureAwait(false);

                if (response?.ReturnObject == null || !response.ReturnObject.Any())
                    return NotFound();
                else
                    return Ok(response);
            }
            else
            {
                var response = await _mediator.Send(new FindSummary.Request { Query = query, WithPaginationInfo = withPaginationInfo, Page = page ?? 1, PageSize = pageSize ?? 10 }).ConfigureAwait(false);

                if (response?.ReturnObject == null || !response.ReturnObject.Any())
                    return NotFound();
                else
                    return Ok(response);
            }           
        }

        [HttpGet]
        [Route("Search")]
        public async Task<IActionResult> Search(string keyword, string searchApplication="SHOP")
        {
            var response = await _mediator.Send(new TypeAheadRequest { Keyword = keyword , SearchApplication = searchApplication }).ConfigureAwait(false);
            return Ok(response);
        }

    }
}
