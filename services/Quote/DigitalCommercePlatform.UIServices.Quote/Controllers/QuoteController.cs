using DigitalCommercePlatform.UIServices.Quote.DTO.Request;
using DigitalCommercePlatform.UIServices.Quote.DTO.Response;
using DigitalCommercePlatform.UIServices.Quote.Generated;
using DigitalFoundation.AppServices.Quote.Models;
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
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class QuoteController : BaseUIServiceController
    {
        private readonly ILogger<QuoteController> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        public QuoteController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            IOptions<AppSettings> options,
            ISiteSettings siteSettings,
            IHttpClientFactory httpClientFactory
            //IHttpContextAccessor httpContextAccessor,
            //IUserIdentity userIdentity,
            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
            //_logger = loggerFactory.BeginScope<QuoteController>();
            _httpClientFactory = httpClientFactory;
        }

        /// <summary>
        /// QuoteController Get by Id
        /// </summary>
        [HttpGet]
        [Route("{id}")]
        public async Task<JsonStringResult> Get(string id, [FromQuery] bool details = true)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var url = "https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1/" + id;
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
                var result = new JsonStringResult(responseBody);
                return result;
            }
            catch (HttpRequestException e)
            {
                var toto = e.Message;
                return null;
            }
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetByIds(
            [FromQuery(Name = "id")] List<string> id, bool details = true)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var url = "https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1/";
            var separator = "?";
            foreach (var item in id)
            {
                url = string.Concat(url, separator + "id=" + item);
                if (separator == "?") { separator = "&"; }
            }
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
                var result = new JsonStringResult(responseBody);
                return result;
            }
            catch (HttpRequestException e)
            {
                var toto = e.Message;
                return null;
            }
        }

        [HttpGet]
        [Route("Find")]
        public async Task<IActionResult> Search([FromQuery] FindModel search)
        {
            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", Context.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", "en-us");
            httpClient.DefaultRequestHeaders.Add("Site", "NA");
            httpClient.DefaultRequestHeaders.Add("Consumer", "NA");
            var url = "https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1/Find?id=" + search.Id;
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
                var result = new JsonStringResult(responseBody);
                return result;
            }
            catch (HttpRequestException e)
            {
                var toto = e.Message;
                return null;
            }
        }

        [HttpGet]
        [Route("GetQuoteSummaryList")]
        public async Task<IEnumerable<QuoteSummaryResponse>> GetQuoteSummaryList(string id, [FromQuery] bool details = true)
        {
            var quote1 = new QuoteSummaryResponse()
            {
                QuoteId = "123456",
                EndUserName = "John Doe",
                VendorReference = "ACME Corporation"
            };
            var quote2 = new QuoteSummaryResponse()
            {
                QuoteId = "8888888",
                EndUserName = "Steve W.",
                VendorReference = "At home"
            };
            var result = new List<QuoteSummaryResponse>()
            {

            };
            result.Add(quote1);
            result.Add(quote2);
            return result;
        }

        [HttpGet]
        [Route("GetQuote")]
        public async Task<ResponseDto<List<QuoteDto>>> GetQuote(string id)
        {
            var jsonResult = await this.Get(id);

            var result = JsonSerializer.Deserialize<ResponseDto<List<QuoteDto>>>(jsonResult.Content, GetJsonSerializerOptions());
            return result;
        }

        private static JsonSerializerOptions GetJsonSerializerOptions()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            return options;
        }
    }

    public class JsonStringResult : ContentResult
    {
        public JsonStringResult(string json)
        {
            Content = json;
            ContentType = "application/json";
        }
    }
}
