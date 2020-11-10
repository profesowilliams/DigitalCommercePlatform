using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Actions.Browse;
using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
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
using Newtonsoft.Json;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class BrowseController : BaseUIServiceController
    {
        private readonly ILogger<BrowseController> _logger;
        private readonly IUserIdentity _userIdentity;

#pragma warning disable S107 // Methods should not have too many parameters

        public BrowseController(
            IMediator mediator,
            IOptions<AppSettings> options,
            ILoggerFactory loggerFactory,
            IUserIdentity userIdentity,
            IContext context,
            IHttpContextAccessor httpContextAccessor,
            ISiteSettings siteSettings)
#pragma warning restore S107 // Methods should not have too many parameters
            : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        {
            _logger = loggerFactory.CreateLogger<BrowseController>();
            _userIdentity = userIdentity;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<GetMenuResponse> GetAsync(string id)
        {
            var orderResponse = await _mediator.Send(new GetMenuRequest { Id = id }).ConfigureAwait(false);
            return orderResponse;
        }

        [HttpGet]
        [Route("testBrowseAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }

        //[HttpGet]
        //[Route("testforjson")]
        //public async Task<GetMenuResponse> Mounika(string filename)
        //{
        //   var 
        //}


        //[HttpGet]
        //public async Task<GetMenu.GetMenuResponse> GetMultiple([FromQuery] ICollection<GetCriteriaDto> criteria)
        //{
        //    _logger.LogInformation($"App.Browse.Get:{JsonConvert.SerializeObject(criteria)}");

        //    return await _mediator.Send(new GetMenu.GetMenuRequest(criteria)).ConfigureAwait(false);
        //}

        [HttpGet]
        [Route("mounika")]
        public string TestForJson()
        {
            string text = System.IO.File.ReadAllText(@"C:\Users\T396608F\Source\Repos\DigitalCommercePlatform3\services\Browse\DigitalCommercePlatform.UIServices.Browse\Menu-in-json.json");
            string jsonString = JsonConvert.SerializeObject(text);
            return jsonString;
        }
    }
}
