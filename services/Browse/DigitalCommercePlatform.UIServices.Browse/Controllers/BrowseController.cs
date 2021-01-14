using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Actions.Browse;
using DigitalCommercePlatform.UIServices.Browse.DTO.Request;
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

namespace DigitalCommercePlatform.UIServices.Browse.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class BrowseController : BaseUIServiceController
    {
        private readonly ILogger<BrowseController> _logger;
        private readonly IMediator _mediator;

        public BrowseController(
            IMediator mediator,
            IHttpContextAccessor httpContextAccessor,
            IOptions<AppSettings> options,
            ILoggerFactory loggerFactory,
            IContext context,
            IUserIdentity userIdentity,
            ISiteSettings siteSettings)
            : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        {
            _logger = loggerFactory.CreateLogger<BrowseController>();
            _mediator = mediator;
        }

        [HttpGet]
        [Route("testBrowseAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }

        [HttpGet]
        [Route("GetMenu")]
        public async Task<string> GetMenuAsync([FromQuery] string accountNumber)
        {
            var menuResponse = await _mediator.Send(new GetMenu.GetMenuRequest { AccountNumber = accountNumber }).ConfigureAwait(false);
            return "Requested account number : " +  accountNumber;
        }
    }
}
