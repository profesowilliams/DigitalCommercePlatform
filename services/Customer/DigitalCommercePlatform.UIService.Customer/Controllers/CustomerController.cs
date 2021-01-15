using DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Find;
using DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Security.Identity;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}/{controller}")]
    public class CustomerController : BaseUIServiceController
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public CustomerController(
            IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings,
            IHttpClientFactory httpClientFactory
            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
            _httpClientFactory = httpClientFactory;
        }

        //[HttpGet]
        //[Route("{name}")]
        //public async Task<ActionResult<GetCustomerResponse>> Get(string name)
        //{
        //    var request = new GetCustomerRequest
        //    {
        //        Id = name,
        //    };
        //    var response = await _mediator.Send(request);
        //    return Ok(response);
        //}

        [HttpGet]
        [Route("{name}")]
        public async Task<JsonResult> Get(string name)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "0006mCkUFmWLnYIxSawBCgMtSxId");
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var url = "https://eastus-dit-service.dc.tdebusiness.cloud/app-customer/v1/" + name;

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri(url),
                Method = HttpMethod.Get,
            };

            try
            {
                HttpResponseMessage response = await httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                return Json(responseBody);
            }
            catch (HttpRequestException)
            {
                return null;
            }
        }

        //[HttpPost]
        //[Route("find")]
        //public async Task<ActionResult<FindCustomerResponse>> Find(FindCustomerRequest request)
        //{
        //    var response = await _mediator.Send(request);
        //    return Ok(response);
        //}

        [HttpGet]
        [Route("Find")]
        public async Task<IActionResult> Find([FromQuery] FindCustomerRequest query, [FromQuery] int? page, [FromQuery] int? pageSize, [FromQuery] bool withPaginationInfo, [FromQuery] bool details = true)
        {

            if (details)
            {
                //query = new FindCustomerRequest 
                //{ 
                //    Query = query, 
                //    WithPaginationInfo = withPaginationInfo, 
                //    Page = page ?? 1, 
                //    PageSize = pageSize ?? 10 
                //};
            }
            else
            {
                //query = new FindCustomerRequest
                //{
                //    Query = query,
                //    WithPaginationInfo = withPaginationInfo,
                //    Page = page ?? 1,
                //    PageSize = pageSize ?? 10
                //};
            }

            var response = await _mediator.Send(query).ConfigureAwait(false);
            if (response?.ReturnObject == null) /*|| !response.ReturnObject.Any())*/
                return NotFound();
            else
                return Ok(response);
        }
    }
}
