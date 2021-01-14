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
    [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class OrderController : BaseUIServiceController//BaseUIServiceController
    {
        public OrderController(
            IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<OrderController> logger,
            IContext context,
            ISiteSettings siteSettings)
            : base(mediator, logger, context, options, siteSettings)
        {
        }

        
        //[HttpGet]
        //[Route("{id}")]
        //public async Task<GetOrderInOneFile> GetAsync(string id)
        //{
        //    var orderResponse = await _mediator.Send(new GetOrderInOneFile { Id = id }).ConfigureAwait(false);
        //    return orderResponse;
        //}


        [HttpGet]
        [Route("testOrderAPI")]
        public string Test([FromQuery] string name)
        {
            return "Welcome " + name + " !";
        }
    }
}
