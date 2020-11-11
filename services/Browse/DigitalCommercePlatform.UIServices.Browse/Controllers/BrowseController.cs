using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Actions.Browse;
using DigitalCommercePlatform.UIServices.Browse.DTO;
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
//using DigitalCommercePlatform.UIServices.Browse.Actions.Customer;

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{​​​​apiVersion}​​​​")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
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
        [Route("testBrowseAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }

        //[HttpGet]
        //[Route("mounika")]
        //public async Task<GetMenu.GetMenuResponseDetails> GetMenu([FromQuery] ICollection<Menu> criteria)
        //{
        //    //_logger.LogInformation($"App.Browse.Get:{JsonConvert.SerializeObject(criteria)}");

        //    return await _mediator.Send(new GetMenu.GetMenuRequest(criteria));
        //        //.ConfigureAwait(false);
        //}



    }
}
