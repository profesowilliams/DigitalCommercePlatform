using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://app-quote/health/heartbeat";

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

            services.AddTransient<ICommerceService, CommerceService>();
            services.AddTransient<ISortingService, SortingService>();
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHeaderPropagation();
            base.ConfigureMiddleSection(app, env);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
