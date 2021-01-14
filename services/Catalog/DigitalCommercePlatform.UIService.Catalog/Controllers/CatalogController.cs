using DigitalCommercePlatform.UIServices.Catalog.DTO.Request;
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

namespace DigitalCommercePlatform.UIServices.Customer.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    public class CatalogController : BaseUIServiceController
    {
        private readonly ILogger<CatalogController> _logger;

        public CatalogController(
            IMediator mediator,
            IHttpContextAccessor httpContextAccessor,
            IOptions<AppSettings> options,
            ILoggerFactory loggerFactory,
            IContext context,
            IUserIdentity userIdentity,
            ISiteSettings siteSettings)
            : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        {
            _logger = loggerFactory.CreateLogger<CatalogController>();
        }
        [HttpGet]
        [Route("testCatalogAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome Catalog " + name + " !";
        }
    }
}
