using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Customer.Controllers
{
    [ApiController]
    [ApiVersion("1")]
    [Route("/v{apiVersion}/{controller}")]
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

    }
}
