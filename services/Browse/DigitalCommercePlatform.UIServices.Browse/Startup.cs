using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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
            services.AddHttpClient("apiServiceClient").AddHeaderPropagation();
            services.AddHeaderPropagation(options =>
            {
                options.Headers.Add("Authorization");
                options.Headers.Add("Accept-Language");
                options.Headers.Add("Site");
                options.Headers.Add("Consumer");
            });

            services.AddTransient<IBrowseService, BrowseService>();
            services.AddSingleton<ICachingService, CachingService>();
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHeaderPropagation();
            base.ConfigureMiddleSection(app, env);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}