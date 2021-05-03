using DigitalCommercePlatform.UIServices.Account.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using DigitalFoundation.Common.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using static RenewalsService.RenewalsServiceClient;

namespace DigitalCommercePlatform.UIServices.Account
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://core-customer/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IRenewalsService>(provider => 
            {
                var renewalsServiceUrl = provider.GetRequiredService<IOptions<AppSettings>>()?.Value?.GetSetting("External.Order.RenewalsService.Url");

                if (string.IsNullOrWhiteSpace(renewalsServiceUrl))
                {
                    throw new InvalidOperationException("External.Order.RenewalsService.Url is missing from AppSettings");
                }

                return new RenewalsServiceClient(EndpointConfiguration.BasicHttpBinding_IRenewalsService, renewalsServiceUrl);
            });


            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<ISecurityService, SecurityService>();
            services.AddTransient<ITimeProvider, DefaultTimeProvider>();
            services.AddTransient<IRenewalsSummaryService, RenewalsSummaryService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}