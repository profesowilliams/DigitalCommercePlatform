//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Features.Logging;
using DigitalFoundation.Common.Security.Token;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using DigitalFoundation.Common.Services.Providers.Localization;
using DigitalFoundation.Common.Services.Providers.Profile;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using static DigitalCommercePlatform.UIServices.Search.Actions.Product.KeywordSearch;

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
            services.AddScoped<IItemsPerPageService, ItemsPerPageService>();

            services.AddScoped<KeywordSearchHandlerArgs>();

            services.AddProfileProvider(StartupLogger);
            services.AddScoped<IProfileService, ProfileService>();

            services.AddScoped<IDefaultIndicatorsService, DefaultIndicatorsService>();

            services.AddScoped<IMarketService, MarketService>();
            services.AddScoped<ICultureService, CultureService>();
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}