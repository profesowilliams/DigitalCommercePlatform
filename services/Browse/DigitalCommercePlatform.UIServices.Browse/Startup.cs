//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Logging;
using DigitalFoundation.Common.Security.Token;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using DigitalFoundation.Common.Services.Providers.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
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
            services.AddTransient<IBrowseService, BrowseService>();
            services.AddSingleton<ICachingService, CachingService>();
            services.AddTransient<ISortingService, SortingService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());

            services.AddDigitalFoundationLocalizationProvider(StartupLogger);
            services.AddSingleton<ITokenManagerService, TokenManagerService>();
            services.AddSingleton<ITranslationService, TranslationService>();

            services.AddSingleton<IMemoryCache, MemoryCache>();
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}