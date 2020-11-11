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

namespace DigitalCommercePlatform.UIServices.Quote.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}")]
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class QuoteController : BaseUIServiceController
    {
        private readonly ILogger<QuoteController> _logger;

        public QuoteController(
            IMediator mediator,
            IHttpContextAccessor httpContextAccessor,
            IOptions<AppSettings> options,
            ILoggerFactory loggerFactory,
            IContext context,
            IUserIdentity userIdentity,
            ISiteSettings siteSettings)
            : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        {
            _logger = loggerFactory.CreateLogger<QuoteController>();
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

    }
}
