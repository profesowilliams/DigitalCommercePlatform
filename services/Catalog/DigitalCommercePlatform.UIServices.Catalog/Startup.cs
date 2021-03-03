using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Catalog
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform" };

        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "https://service.dit.df.svc.us.tdworldwide.com/app-Catalog/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
        }
    }
}