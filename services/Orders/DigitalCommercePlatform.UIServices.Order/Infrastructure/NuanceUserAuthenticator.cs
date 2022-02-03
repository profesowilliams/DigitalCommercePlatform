//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Features.Contexts.Models.Nuance;
using DigitalFoundation.Common.Interfaces;
using DigitalFoundation.Common.Security;
using DigitalFoundation.Common.Security.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure
{
    public class NuanceUserAuthenticator : IUserAuthenticator
    {
        private readonly ILogger<NuanceUserAuthenticator> _logger;
        private readonly IHashingService _hashingService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserInfoService _userInfoService;

        public NuanceUserAuthenticator(
            ILogger<NuanceUserAuthenticator> logger, IHashingService hashingService,
            IHttpContextAccessor contextAccessor, IUserInfoService userInfoService)
        {
            _logger = logger;
            _hashingService = hashingService;
            _contextAccessor = contextAccessor;
            _userInfoService = userInfoService;
        }

        public User GetUser()
        {
            var requestUserHeader = GetNuanceRequestHeader(ObjectExtensions.PassThrowNonNull(_contextAccessor).HttpContext);
            
            if (requestUserHeader == null)
            {
                _logger.LogWarning("Authentication failed");
                return null;
            }

            var user = GetUserInformation(requestUserHeader.EcId, requestUserHeader.ResellerId);

            return user;
        }

        private User GetUserInformation(string userId, string resellerId)
        {
            User retUser;
            try
            {
                retUser = _userInfoService.LookupUserData(userId, resellerId);
            }
            catch (UnauthorizedImpersonationRequestException)
            {
                _logger.LogError("Authentication Failed. Application not allowed to impersonate User");
                return null;
            }

            return retUser;
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
