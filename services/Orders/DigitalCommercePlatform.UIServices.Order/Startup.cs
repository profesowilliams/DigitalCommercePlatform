//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Features.Logging;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Interfaces;
using DigitalFoundation.Common.Providers.Cryptography;
using DigitalFoundation.Common.Security.BasicAuthorizationHelper;
using DigitalCommercePlatform.UIServices.Order.Infrastructure;
using DigitalFoundation.Common.Security.Token;

namespace DigitalCommercePlatform.UIServices.Order
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        protected override string HealthCheckEndpoint => "http://app-order/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IOrderService, OrderService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());
            services.AddSingleton<ITokenManagerService, TokenManagerService>();
            services.AddScoped<IDigitalFoundationClient, DigitalFoundationClient>();

            services.AddSingleton<IKeyVaultKeysProvider, AzureKeyVaultKeysProvider>();
            services.AddScoped<IHashingService, DefaultHashingService>();
            services.AddScoped<IBasicAuthUserService, BasicAuthUserService>();
            services.AddNuanceAuthentication();
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };
    }
}
