//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [ApiController]
    [Authorize(AuthenticationSchemes = "AccessTokenAuthentication")]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class NuanceController : BaseController
    {
        private readonly ILogger<NuanceController> _logger;
        private readonly INuanceService _nuanceService;

        public NuanceController(
            IMediator mediator, 
            ILogger<NuanceController> logger, 
            INuanceService nuanceService) : base(mediator, logger)
        {
            _logger = logger;
            _nuanceService = nuanceService;
        }

        [HttpGet]
        [Route("nuance/userdata")]
        public IActionResult GetUserData()
        {
            _logger.LogDebug("Nuance Web Chat :: Get User data : Start");

            var userObject = _nuanceService.GetUserData(HttpContext.User);
            return Ok(userObject);
        }
    }
}
