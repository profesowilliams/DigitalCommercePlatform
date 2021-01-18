using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "https://eastus-dit-service.dc.tdebusiness.cloud/core-security/health/heartbeat";
                                                          
        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<CoreSecurityEndpointsOptions>(Configuration.GetSection(CoreSecurityEndpointsOptions.CoreSecurityEndpoints));
            services.Configure<OAuthClientDetailsOptions>(Configuration.GetSection(OAuthClientDetailsOptions.OAuthClientDetails));
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
