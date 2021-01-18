//using DigitalCommercePlatform.UIServices.Browse.Actions.Browse;
using DigitalCommercePlatform.UIServices.Browse.DTO;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

//using QuickType;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class BrowseController : BaseUIServiceController
    {
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        //private readonly ILogger<BrowseController> _logger;
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        //private readonly IMediator _mediator;
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        //private readonly IUserIdentity userIdentity;

        public BrowseController(
                        IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            //IUserIdentity userIdentity,
            IContext context,
            ISiteSettings siteSettings)
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        //    IMediator mediator,
        //    IHttpContextAccessor httpContextAccessor,
        //    IOptions<AppSettings> options,
        //    ILoggerFactory loggerFactory,
        //    IContext context,
        //   // IUserIdentity userIdentity,
        //    ISiteSettings siteSettings)
        //    : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        //{
        //    _logger = loggerFactory.CreateLogger<BrowseController>();
        //    _mediator = mediator;
        //}

        [HttpGet]
        [Route("testBrowseAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }

#pragma warning disable CS0108 // Member hides inherited member; missing new keyword
        public Menu Json { get; set; }
#pragma warning restore CS0108 // Member hides inherited member; missing new keyword
        public Menu SecondJson { get; set; }

        [HttpGet]
        [Route("testMultiple")]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<Menu> Menu()
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            try
            {
                string rawJson = System.IO.File.ReadAllText(@"..\DigitalCommercePlatform.UIServices.Browse\Menu-in-json-String.json");
                dynamic json = System.Text.Json.JsonSerializer.Deserialize<Menu>(rawJson);

                //var data = (JObject)JsonConvert.DeserializeObject(rawJson);
                //string timeZone = data["Menu"].Value<Menu>();

                //   dynamic json = JValue.Parse(rawJson);

                //foreach (var FirstValue in rawJson)
                //{
                //    dynamic json = System.Text.Json.JsonSerializer.Deserialize<Menu>(rawJson);
                //    foreach (var Seconvalue in json.Menu)
                //    {
                //        dynamic SecondJson = System.Text.Json.JsonSerializer.Deserialize<SubMenu>(json);
                //        //return SecondJson;
                //    }
                //}
                //= JValue.Parse(rawJson);
                //return
                // = JsonConvert.DeserializeObject(rawJson);
                // = JsonConvert.DeserializeObject<Menu>(rawJson);

                // return MainMenu;
                return json;
            }
            catch (Exception ex)
            {
                //return ex;
                throw ex;
#pragma warning disable CS0162 // Unreachable code detected
                return null;
#pragma warning restore CS0162 // Unreachable code detected
            }
        }

        [HttpGet]
        [Route("GetMenu")]
#pragma warning disable CS1998 // Async method lacks 'await' operators and will run synchronously
        public async Task<string> GetMenuAsync([FromQuery] string accountNumber)
#pragma warning restore CS1998 // Async method lacks 'await' operators and will run synchronously
        {
            //var menuResponse = await _mediator.Send(new GetMenu.GetMenuRequest { AccountNumber = accountNumber }).ConfigureAwait(false);
            return "Requested account number : " + accountNumber;
        }

        [HttpGet]
        [Route("Test")]
        public void GetResultofJson()
        {
            var jsonString = System.IO.File.ReadAllText(@"..\DigitalCommercePlatform.UIServices.Browse\Menu-in-json.json");
            JArray jsonVal = JArray.Parse(jsonString);
            dynamic albums = jsonVal;
            foreach (dynamic album in albums)
            {
                //album;
                Console.WriteLine(album + " (" + album.ToString() + ")");
                //foreach (dynamic song in album.Songs)
                //{
                //    Console.WriteLine("\t" + song.SongName);
                //}
            }
            //JArray jsonVal = JArray.Parse(JsonArraytext) as JArray;
            //dynamic albums = jsonVal;
            //foreach (dynamic album in albums)
            //{
            //    Console.WriteLine(album.path + " &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp(" + album.lastModified + ")");
            //    //foreach (dynamic song in album.Songs)
            //    //{
            //    //    Console.WriteLine("\t" + song.SongName);
            //    //}
            //}
        }
    }
}