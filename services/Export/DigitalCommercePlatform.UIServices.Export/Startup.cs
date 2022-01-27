//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Features.Logging;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export
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
            services.AddTransient<ICommerceService, CommerceService>();
            services.AddTransient<IRenewalService, RenewalService>();

            services.AddTransient<IOrderDetailsDocumentGenerator, OrderDetailsDocumentGenerator>();
            services.AddSingleton<IOrderDetailsDocumentGeneratorSettings, OrderDetailsDocumentGeneratorSettings>();
            services.AddTransient<IQuoteDetailsDocumentGenerator, QuoteDetailsDocumentGenerator>();
            services.AddSingleton<IQuoteDetailsDocumentGeneratorSettings, QuoteDetailsDocumentGeneratorSettings>();
            services.AddTransient<IRenewalQuoteDetailsDocumentGenerator, RenewalQuoteDetailsDocumentGenerator>();
            services.AddSingleton<IRenewalQuoteDetailsDocumentGeneratorSettings, RenewalQuoteDetailsDocumentGeneratorSettings>();

            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());
            services.AddHttpClient("OneSourceClient");
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
