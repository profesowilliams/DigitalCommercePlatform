using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseUIServiceStartup
    {

        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://app-catalog/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IBrowseService, BrowseService>();
            services.AddSingleton<ICachingService, CachingService>();
        }


        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}