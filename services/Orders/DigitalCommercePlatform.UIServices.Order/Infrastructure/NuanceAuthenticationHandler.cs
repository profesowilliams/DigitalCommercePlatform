using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Constants;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure
{
    public class NuanceAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly User user;

        public NuanceAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IUserAuthenticator userAuthenticator,
            IUIContext context) : base(options, logger, encoder, clock)
        {
            user = userAuthenticator.GetUser();
            if (user != null)
                context.SetUser(user);
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var endpoint = ((DefaultHttpContext)Context).HttpContext.GetEndpoint();
            if (endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null)
                return Task.FromResult(AuthenticateResult.NoResult());

            if (user == null)
                return Task.FromResult(AuthenticateResult.Fail("Invalid user authentication data"));

            var ticket = GenerateTicket(user);

            return Task.FromResult(AuthenticateResult.Success(ticket));
        }

        private AuthenticationTicket GenerateTicket(User user)
        {
            var claims = new List<Claim>();

            claims.Add(new Claim(UserClaimTypes.ID, user.ID));
            claims.Add(new Claim(UserClaimTypes.FirstName, user.FirstName));
            claims.Add(new Claim(UserClaimTypes.LastName, user.LastName));

            if (user.ActiveCustomer != null)
                claims.Add(new Claim(UserClaimTypes.ActiveCustomer, user.ActiveCustomer.CustomerNumber));

            var identity = new ClaimsIdentity(claims.ToArray(), Scheme.Name, UserClaimTypes.ID, null);
            var principal = new ClaimsPrincipal(identity);
            return new AuthenticationTicket(principal, Scheme.Name);
        }
    }
}
