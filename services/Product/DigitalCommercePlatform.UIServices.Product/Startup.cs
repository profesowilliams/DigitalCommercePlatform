using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DigitalFoundation.Common.Services.StartupConfiguration;
using DigitalCommercePlatform.UIServices.Product.Services;

namespace DigitalCommercePlatform.UIServices.Product
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://app-product/health/heartbeat";

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

            services.AddTransient<IProductService, HttpProductService>();
            //services.AddSingleton<ICachingServicec, CachingService>();
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHeaderPropagation();
            base.ConfigureMiddleSection(app, env);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
