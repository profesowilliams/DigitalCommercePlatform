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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Controllers
{
   // [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class SecurityController : BaseUIServiceController
    {
        public SecurityController(IMediator mediator,
            IOptions<AppSettings> options,
            ILoggerFactory loggerFactory,
            IUserIdentity userIdentity,
            IContext context,
            IHttpContextAccessor httpContextAccessor,
            ISiteSettings siteSettings)
            : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        {

        }


        [HttpGet]
        [Route("testSecurityAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }
    }
}