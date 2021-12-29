//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Security;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure
{
    public static class NuanceAuthenticationServiceExtension
    {
        public static AuthenticationBuilder AddNuanceAuthentication(this IServiceCollection services)
        {
            services.AddScoped<IUserAuthenticator, NuanceUserAuthenticator>();
            
            return services.AddAuthentication()
                .AddScheme<AuthenticationSchemeOptions, NuanceAuthenticationHandler>("NuanceAuth", null);
        }
    }
}
