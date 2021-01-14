using DigitalCommercePlatform.UIServices.Security.Infrastructure;
using DigitalCommercePlatform.UIServices.Security.Services;
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
    public class Startup : BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "https://eastus-dit-service.dc.tdebusiness.cloud/core-security/health/heartbeat";
                                                          
        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<CoreSecurityEndpointsOptions>(Configuration.GetSection(CoreSecurityEndpointsOptions.CoreSecurityEndpoints));
            
            services.AddHttpContextAccessor();
            
            services.AddHttpClient("GetTokenClient");
            
            services.AddHttpClient("CoreSecurityClient").AddHeaderPropagation();
            services.AddHeaderPropagation(options =>
            {
                options.Headers.Add("Accept-Language");
                options.Headers.Add("Site");
                options.Headers.Add("Consumer");
            });

            services.AddDistributedRedisCache(options => {
                options.Configuration = Configuration.GetConnectionString("Redis");
                options.InstanceName = "[Security>UI]_";
            });

            services.AddTransient<IUserService, HttpUserService>();

            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(HttpGlobalExceptionFilter));
            }).AddNewtonsoftJson();
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseMiddleware<ExceptionHandlerMiddleware>();


            app.UseHeaderPropagation();
            base.ConfigureMiddleSection(app,env);
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };

    }

}
