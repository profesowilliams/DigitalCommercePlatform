using DigitalCommercePlatform.UIService.Customer.Actions;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Controllers
{
    [ExcludeFromCodeCoverage]
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}/{controller}")]
    //[Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    public class CustomerController : BaseUIServiceController
    {
        public CustomerController(
            IMediator mediator,
            IOptions<AppSettings> options,
            ILogger<BaseUIServiceController> loggerFactory,
            IContext context,
            ISiteSettings siteSettings
            )
            : base(mediator, loggerFactory, context, options, siteSettings)
        {
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<ActionResult<CustomerGet.Response>> Get(string id)
        {
            var request = new CustomerGet.Request(id, Context.AccessToken);
            var response = await Mediator.Send(request);
            return Ok(response);
        }

        //[HttpGet]
        //[Route("")]
        //public async Task<ActionResult<CustomerGetByIds.Response>> GetByIds([FromQuery(Name = "id")] IEnumerable<string> ids)
        //{
        //    var request = new CustomerGetByIds.Request(ids, Context.AccessToken);
        //    var response = await Mediator.Send(request);
        //    return Ok(response);
        //}

        [HttpPost]
        [Route("find")]
        public async Task<ActionResult<CustomerFind.Response>> Find(CustomerFind.Request request)
        {
            request.AccessToken = Context.AccessToken;
            var response = await Mediator.Send(request);
            return Ok(response);
        }
    }
}
