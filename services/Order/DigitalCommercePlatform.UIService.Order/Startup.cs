using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace DigitalCommercePlatform.UIService.Order
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "https://service.dit.df.svc.us.tdworldwide.com/app-order/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
        }
    }
}
