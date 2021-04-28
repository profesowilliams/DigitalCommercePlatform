using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Filters;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;

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
            services.AddTransient<ISortingService, SortingService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors(cfg => cfg.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
            base.ConfigureMiddleSection(app, env);
        }
        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}