using DigitalCommercePlatform.UIServices.Quote.Actions.Quote;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}/demo")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class DemoController : BaseUIServiceController
    {
        public DemoController(
            IMediator mediator,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            IOptions<AppSettings> options,
            ISiteSettings siteSettings
            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        [HttpGet]
        [Route("testQuoteAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }

        [HttpGet]
        [Route("GetDealsForGrid")]
        public async Task<IActionResult> GetDealsForGrid(string creator)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\Deals.json";
            using (var reader = System.IO.File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetDealsForGridResponse(fileContent);
                dynamic response = JObject.Parse(result.Content);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("GetConfigsForGrid")]
        public async Task<IActionResult> GetConfigsForGrid(string creator)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\Configs.json";
            using (var reader = System.IO.File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetConfigsForGridResponse(fileContent);
                dynamic response = JObject.Parse(result.Content);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("GetRenewalsForGrid")]
        public async Task<IActionResult> GetRenewalsForGrid(string creator)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\Renewals.json";
            using (var reader = System.IO.File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetRenewalsForGridResponse(fileContent);
                dynamic response = JObject.Parse(result.Content);
                return Ok(response);
            }
        }

        [HttpGet]
        [Route("GetTdQuotesForGrid")]
        public async Task<IActionResult> GetTdQuotesForGrid(string creator)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\TDQuotes.json";
            using (var reader = System.IO.File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                dynamic response = JObject.Parse(fileContent);
                return Ok(response);
            }
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
