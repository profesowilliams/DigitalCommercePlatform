using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using DigitalFoundation.Common.Settings;
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
            services.AddCors();
            base.ConfigureServices(services);
        }

        public override void Configure(IApplicationBuilder app, IWebHostEnvironment env, IOptions<RequestLocalizationOptions> localizationOptions)
        {
            var options = app.ApplicationServices.GetService<IOptions<AppSettings>>();
            var corsAllowedOrigin = options?.Value.GetSetting("UI.Security.CorsAllowedOrigin");
            var corsAllowedHeaders = options?.Value.GetSetting("UI.Security.CorsAllowedHeaders");
            var corsAllowedMethods = options?.Value.GetSetting("UI.Security.CorsAllowedMethods");
            app.UseCors(configurePolicy =>
            {
                configurePolicy.WithOrigins(corsAllowedOrigin?.Split(','))
                            .WithHeaders(corsAllowedHeaders?.Split(','))
                            .WithMethods(corsAllowedMethods?.Split(','));
            });
            base.Configure(app, env, localizationOptions);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
