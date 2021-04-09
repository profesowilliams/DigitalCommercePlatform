using AutoMapper;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace DigitalCommercePlatform.UIServices.Customer
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        protected override string HealthCheckEndpoint => "http://app-customer/health/heartbeat";

        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddAutoMapper(typeof(Startup));
        }
    }
}
