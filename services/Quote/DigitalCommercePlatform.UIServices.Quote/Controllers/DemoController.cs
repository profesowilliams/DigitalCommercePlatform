using DigitalCommercePlatform.UIServices.Quote.DTO.Request;
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
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class DemoController : BaseUIServiceController
    {
        private readonly ILogger<QuoteController> _logger;

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

        [HttpPost]
        [Route("GetQuote")]
        public string GetQuote([FromBody] QuoteRequest request)
        {
            return "Menu";
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
    }
}
