//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Features.Logging;
using DigitalFoundation.Common.Security.Token;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using DigitalFoundation.Common.Services.Providers.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search
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
            services.AddTransient<ISearchService, SearchService>();
            services.AddTransient<IContentService, ContentService>();
            services.AddTransient<IRedirectService, RedirectService>();
            services.AddTransient<ICsvService, CsvService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());

            services.AddDigitalFoundationLocalizationProvider(StartupLogger);
            services.AddSingleton<ITokenManagerService, TokenManagerService>();

            services.AddTransient<SearchServiceArgs>();
            services.AddSingleton<ITranslationService, TranslationService>();
            services.AddScoped<ISortService, SortService>();
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}