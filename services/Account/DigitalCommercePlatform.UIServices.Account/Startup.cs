//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using DigitalFoundation.Common.Services.UI.ExceptionHandling;
using DigitalFoundation.Common.Settings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.ServiceModel;

namespace DigitalCommercePlatform.UIServices.Account
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
            services.AddScoped<IRenewalsService>(provider =>
            {
                var renewalsServiceUrl = provider.GetRequiredService<IAppSettings>().GetSetting("External.Order.RenewalsService.Url");

                if (string.IsNullOrWhiteSpace(renewalsServiceUrl))
                {
                    throw new InvalidOperationException("External.Order.RenewalsService.Url is missing from AppSettings");
                }

                var endpointAddress = new EndpointAddress(renewalsServiceUrl);
                var binding = new BasicHttpBinding
                {
                    MaxBufferSize = int.MaxValue,
                    ReaderQuotas = System.Xml.XmlDictionaryReaderQuotas.Max,
                    MaxReceivedMessageSize = int.MaxValue,
                    AllowCookies = true
                };
                binding.Security.Mode = BasicHttpSecurityMode.Transport;

                return new RenewalsServiceClient(binding, endpointAddress);
            });

            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<ISecurityService, SecurityService>();
            services.AddTransient<IVendorService, VendorService>();
            services.AddTransient<ITimeProvider, DefaultTimeProvider>();
            services.AddTransient<IRenewalsSummaryService, RenewalsSummaryService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
