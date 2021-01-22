using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace DigitalCommercePlatform.UIService.Product
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "https://service.dit.df.svc.us.tdworldwide.com/app-Product/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
        }

        //protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
        //public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        //{
        //    services.Configure<CoreProductEndPointsOptions>(Configuration.GetSection(CoreProductEndPointsOptions.CoreProductEndPoints));

        //    services.AddHttpClient("CoreProduct").AddHeaderPropagation();
        //    services.AddHeaderPropagation(options =>
        //    {
        //        options.Headers.Add("Accept-Language");
        //        options.Headers.Add("Authorization");
        //        options.Headers.Add("Site");
        //        options.Headers.Add("TraceId");
        //        options.Headers.Add("Consumer");
        //    });
        //}

        //public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        //{
        //    app.UseHeaderPropagation();
        //    base.ConfigureMiddleSection(app, env);
        //}

        //protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
