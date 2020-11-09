using DigitalCommercePlatform.UIServices.Order.DTO.Request;
using DigitalCommercePlatform.UIServices.Order.DTO.Response;
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

namespace DigitalCommercePlatform.UIServices.Order.Controllers
{
    //[Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class OrderController : BaseUIServiceController
    {
        private readonly ILogger<OrderController> _logger;
        private readonly IUserIdentity _userIdentity;

#pragma warning disable S107 // Methods should not have too many parameters

        public OrderController(
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
            _logger = loggerFactory.CreateLogger<OrderController>();
            _userIdentity = userIdentity;
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<GetOrderResponse> GetAsync(string id)
        {
            var orderResponse = await _mediator.Send(new GetOrderRequest { Id = id }).ConfigureAwait(false);
            return orderResponse;
        }

        [HttpGet]
        [Route("testBrowseAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }
    }
}
