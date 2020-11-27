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
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Security.Controllers
{
   // [Authorize(AuthenticationSchemes = "UserIdentityValidationScheme")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class SecurityController : BaseUIServiceController
    {
        private readonly IHttpClientFactory _clientFactory;

        public SecurityController(IMediator mediator,
            IOptions<AppSettings> options,
            ILoggerFactory loggerFactory,
            IUserIdentity userIdentity,
            IContext context,
            IHttpContextAccessor httpContextAccessor,
            ISiteSettings siteSettings, IHttpClientFactory clientFactory)
            : base(mediator, httpContextAccessor, loggerFactory, context, userIdentity.User, options, siteSettings)
        {
            _clientFactory = clientFactory;
        }


        [HttpGet]
        [Route("testSecurityAPI")]
        public async Task<string>  Test([FromQuery] string name)
        {
            var req = new HttpRequestMessage(HttpMethod.Get, "http://core-security/v1/validate/a"); // "http://core-security/v1/validate/a" http://service.dit.df.svc.us.tdworldwide.com/core-security/v1/validate/a
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", "0006pMJxGwgveayzJT02cEiToiLF");
            req.Headers.Add("Site", "ecom.apps.web.aem");
            req.Headers.Add("Consumer", "f");
            req.Headers.Add("Accept-Language", "en");

            var client = _clientFactory.CreateClient();

            var response = await client.SendAsync(req).ConfigureAwait(false);

            if (response.IsSuccessStatusCode)
            {
                var responseStream = await response.Content.ReadAsStringAsync().ConfigureAwait(false); ;
            }


            return "Welcome " + name + " !";
        }
    }
}