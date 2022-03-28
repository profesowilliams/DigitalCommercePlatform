//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Enums;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Services.Base;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [ApiVersion("1.0")]
    [Route("/v{apiVersion}")]
    public class CustomerController : BaseController
    {
        private readonly ILogger<CustomerController> _logger;
        private readonly ICustomerService _customerService;

        public CustomerController(IMediator mediator,
            ILogger<CustomerController> logger,
            ICustomerService customerService
            )
            : base(mediator, logger)
        {
            _logger = logger;
            _customerService = customerService;
        }

        [HttpPost]
        [Route("RegisterCustomer")]
        public async Task<IActionResult> RegisterCustomerAsync([FromBody, NotNull] RegisterCustomerRequestModel request)
        {
            var response = await _customerService.RegisterCustomerAsync(request).ConfigureAwait(false);

            if (response.IsError)
            {
                return StatusCode(GetStatusCode(response.ErrorType), response);
            }

            return Ok(response);
        }

        private static int GetStatusCode(RegistrationErrorType errorType)
        {
            switch (errorType)
            {
                case RegistrationErrorType.AlreadyExists: return 400;
                case RegistrationErrorType.HttpError: return 400;
                case RegistrationErrorType.InternalError: return 500;
                default: return 500;
            }
        }
    }
}