//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.Features.Logging;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Interfaces;
using DigitalFoundation.Common.Providers.Cryptography;
using DigitalFoundation.Common.Security.BasicAuthorizationHelper;
using DigitalCommercePlatform.UIServices.Order.Infrastructure;
using DigitalFoundation.Common.Security.Token;
using DigitalFoundation.Common.Services.Base;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using DigitalFoundation.Common.Providers.IdBinders;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Security.Extensions;
using DigitalFoundation.Common.Features.Swagger;
using DigitalFoundation.Common.Security.PolicyAuthorization.AuthorizationHandlers;
using DigitalFoundation.Common.Security.PolicyAuthorization.Providers;
using DigitalFoundation.Common.Services.Features.HealthChecks.Extensions;
using Microsoft.AspNetCore.Routing;
using DigitalFoundation.Common.Services.Features.HealthChecks.Types;
using Microsoft.Extensions.Hosting;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace DigitalCommercePlatform.UIServices.Order
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseStartupWithSettings //: BaseUIServiceStartup
    {
        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        public override void Configure(IApplicationBuilder app, IWebHostEnvironment env,
            IHostApplicationLifetime applicationLifetime, TelemetryClient telemetryClient)
        {
            UseCustomCorsPolicy(app);
            base.Configure(app, env, applicationLifetime, telemetryClient);
        }

        private static void UseCustomCorsPolicy(IApplicationBuilder app)
        {
            var appSettings = app.ApplicationServices.GetService(typeof(IAppSettings)) as IAppSettings;

            var corsAllowedOrigin = appSettings?.GetSetting("UI.Security.CorsAllowedOrigin");
            var corsAllowedHeaders = appSettings?.GetSetting("UI.Security.CorsAllowedHeaders");
            var corsAllowedMethods = appSettings?.GetSetting("UI.Security.CorsAllowedMethods");
            app.UseCors(configurePolicy =>
            {
                configurePolicy.SetIsOriginAllowedToAllowWildcardSubdomains()
                            .WithOrigins(corsAllowedOrigin?.Split(','))
                            .WithHeaders(corsAllowedHeaders?.Split(','))
                            .WithMethods(corsAllowedMethods?.Split(','));
            });
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            BinderProviders.Add(new IdBinderProvider());
            services.AddCors();
            services.AddDigitalFoundationUIContext(StartupLogger);
            services.AddMiddleTierHttpClient(StartupLogger);
            services.AddUIServiceAuthentication();
            services.AddSwaggerGenConfig(StartupLogger);
            //services.AddBasicAuthorizationPolicies(AuthenticationScheme.SessionIDHeaderScheme);

            base.ConfigureServices(services);
        }

        public override void AddHeartbeatHealthCheck(IServiceCollection services)
        {
            services.AddWebApiHealthCheck(HealthCheckEndpoint);
            base.AddHeartbeatHealthCheck(services);
        }

        protected string HealthCheckEndpoint => "http://app-order/health/heartbeat";

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddTransient<IOrderService, OrderService>();
            services.Configure<MvcOptions>(opts => opts.Filters.Add<HttpGlobalExceptionFilter>());
            services.AddSingleton<ITokenManagerService, TokenManagerService>();
            services.AddScoped<IDigitalFoundationClient, DigitalFoundationClient>();
            services.AddScoped<IUserInfoService, UserInfoService>();

            services.AddSingleton<IKeyVaultKeysProvider, AzureKeyVaultKeysProvider>();
            services.AddScoped<IHashingService, DefaultHashingService>();
            services.AddScoped<IBasicAuthUserService, BasicAuthUserService>();
            services.AddNuanceAuthentication();

            services.AddSingleton<IAuthorizationHandler, RoleHandler>();
            services.AddSingleton<IAuthorizationPolicyProvider>((serviceProvider) =>
            {
                var options = serviceProvider.GetRequiredService<IOptions<AuthorizationOptions>>();
                return new RolePolicyProvider(options, "NuanceAuth");
            });
        }

        public override void ConfigureMiddleSection(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseAuthorization();
        }

        protected override IEnumerable<string> AllowedNamespaces => new[] { "DigitalCommercePlatform." };

        public override void MapDigitalFoundationHealthChecks(IEndpointRouteBuilder endpointRouteBuilder)
        {
            endpointRouteBuilder.MapDigitalFoundationHealthChecks(new HeartBeatHealthCheckType(), new WebAppHealthCheckType());
            base.MapDigitalFoundationHealthChecks(endpointRouteBuilder);
        }
    }
}
