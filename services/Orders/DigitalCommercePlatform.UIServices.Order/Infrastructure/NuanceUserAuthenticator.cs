//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Features.Contexts.Models.Nuance;
using DigitalFoundation.Common.Interfaces;
using DigitalFoundation.Common.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure
{
    public class NuanceUserAuthenticator : IUserAuthenticator
    {
        private readonly ILogger<NuanceUserAuthenticator> _logger;
        private readonly IHashingService _hashingService;
        private readonly IHttpContextAccessor _contextAccessor;

        public NuanceUserAuthenticator(ILogger<NuanceUserAuthenticator> logger, IHashingService hashingService, IHttpContextAccessor contextAccessor)
        {
            _logger = logger;
            _hashingService = hashingService;
            _contextAccessor = contextAccessor;
        }

        public User GetUser()
        {
            var requestUserHeader = GetNuanceRequestHeader(ObjectExtensions.PassThrowNonNull(_contextAccessor).HttpContext);
            
            if (requestUserHeader == null)
            {
                _logger.LogWarning("Authentication failed");
                return null;
            }

            return new User()
            {
                ID = requestUserHeader.EcId,
                FirstName = requestUserHeader.Name,
                LastName = requestUserHeader.LastName,
                ActiveCustomer = new Customer()
                {
                    CustomerNumber = requestUserHeader.ResellerId
                }
            };
        }

        private RequestHeader GetNuanceRequestHeader(HttpContext context)
        {
            context.Request.EnableBuffering();
            var requestBody = context.Request.ReadFromJsonAsync<NuanceWebChatRequest>().GetAwaiter().GetResult();
            if (requestBody == null)
            {
                _logger.LogWarning("No Nuance User header provided");
                return null;
            }

            if (!ValidateHmac(requestBody.Header))
            {
                _logger.LogWarning("Nuance User header tampered");
                return null;
            }
            context.Request.Body.Position = 0;

            return requestBody.Header;
        }

        private bool ValidateHmac(RequestHeader input)
        {
            var nuanceUser = new NuanceUser()
            {
                ECID = input.EcId,
                FirstName = input.Name,
                LastName = input.LastName,
                ResellerID = input.ResellerId
            };

            var payload = $"{nuanceUser.ECID};{nuanceUser.FirstName};{nuanceUser.LastName};{nuanceUser.ResellerID}";

            return _hashingService.validateHMAC(payload, input.Hmac);
        }
    }
}
