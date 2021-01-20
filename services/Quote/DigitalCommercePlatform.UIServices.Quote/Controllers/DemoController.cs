using DigitalCommercePlatform.UIServices.Quote.DTO.Response;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class DemoController : BaseUIServiceController
    {
        //private readonly ILogger<QuoteController> _logger;

        public DemoController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            IOptions<AppSettings> options,
            ISiteSettings siteSettings
            //IHttpContextAccessor httpContextAccessor,
            //IUserIdentity userIdentity,
            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
            //_logger = loggerFactory.BeginScope<QuoteController>();
        }
        [HttpGet]
        [Route("testQuoteAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }

        [HttpGet]
        [Route("getQuotes")]
        public JsonStringResult GetQuotes([FromQuery] string countryCode)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Data\TDQuotes.json";
            string content = System.IO.File.ReadAllText(filename);
            return new JsonStringResult(content);
        }
        public class JsonStringResult : ContentResult
        {
            public JsonStringResult(string json)
            {
                Content = json;
                ContentType = "application/json";
            }
        }

        [HttpGet]
        [Route("GetQuoteSummaryList")]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<IEnumerable<QuoteSummaryResponse>> GetQuoteSummaryList(string id, [FromQuery] bool details = true)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
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


        //[httpget]
        //[route("getquote")]
        //public async task<responsedto<list<quotedto>>> getquote(string id)
        //{
        //    var jsonresult = await this.get(id);

        //    var quote = jsonserializer.deserialize<responsedto<list<quotedto>>>(jsonresult.content, getjsonserializeroptions());

        //    return quote;
        //}

        private static JsonSerializerOptions GetJsonSerializerOptions()
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };
            return options;
        }
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

