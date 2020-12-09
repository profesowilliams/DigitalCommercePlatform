using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "https://service.dit.df.svc.us.tdworldwide.com/core-security/health/heartbeat";
                                                          
        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<CoreSecurityEndpointsOptions>(Configuration.GetSection(CoreSecurityEndpointsOptions.CoreSecurityEndpoints));

            services.AddHttpClient("CoreSecurityClient").AddHeaderPropagation();
            services.AddHeaderPropagation(options =>
            {
                options.Headers.Add("Accept-Language");
                options.Headers.Add("Authorization");
                options.Headers.Add("Site");
                options.Headers.Add("TraceId");
                options.Headers.Add("Consumer");
            });
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHeaderPropagation();
            base.ConfigureMiddleSection(app,env);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };

    }
}
