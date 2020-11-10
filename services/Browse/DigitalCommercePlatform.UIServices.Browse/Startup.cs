using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://core-order/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
        }
    }
}