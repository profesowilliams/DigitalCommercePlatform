using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://app-quote/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IConfigService, ConfigService>();
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                            .WithHeaders("Accept-Language", "Authorization", "Consumer", "Content-Length", "Content-Type", "SessionId", "Site", "TraceId", "X-Requested-With")
                            .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS");
                    });
            });
            base.ConfigureServices(services);
        }

        public override void Configure(IApplicationBuilder app, IWebHostEnvironment env, IOptions<RequestLocalizationOptions> localizationOptions)
        {
            app.UseCors();
            base.Configure(app, env, localizationOptions);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
