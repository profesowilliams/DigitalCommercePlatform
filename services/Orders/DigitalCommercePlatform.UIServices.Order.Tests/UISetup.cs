//2021 (c) Tech Data Corporation - All Rights Reserved.
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Net.Http;
using DigitalCommercePlatform.UIServices.Order.Infrastructure;

namespace DigitalCommercePlatform.UIServices.Order.Tests
{
    public class UISetup : Setup
    {
        private readonly HttpClient coreClient;

        public UISetup()
        {
            this.coreClient = null;
        }

        public UISetup(HttpClient coreClient)
        {
            this.coreClient = coreClient;
        }

        public override void AddClients(ITestHttpClientFactory factory, string serviceName)
               => factory
                   .AddClient<ISimpleHttpClient>(coreClient)
                       .MatchContains($"AppSetting/{serviceName}")
                           .Returns(Defaults.GetAppSettings()
                                .Extend("UI.Security.CorsAllowedOrigin", "true")
                                .Extend("UI.Security.CorsAllowedHeaders", "true")
                                .Extend("UI.Security.CorsAllowedMethods", "true")
                                .Extend("MaxPageSize", "100")
                                .Extend("App.Renewal.Url", "v1")
                                .Extend("App.Quote.Url", "v1")
                                .Extend("App.Order.Url", "v1")
                   )
                       .MatchContains($"SiteSetting/{serviceName}")
                           .Returns(Defaults.GetSiteSettings())
                       .Build()
                   .AddClient<IDigitalFoundationClient>(coreClient)
                       .Build();

        public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
            => serviceDescriptors
                .AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();

        public override void RegisterMocks(IStartupDependencySetterBase services)
        {
            services
                .SetMockable<IUIContext>()
                .Wrap(x =>
                {
                    x.SetUser(new User
                    {
                        ID = Guid.NewGuid().ToString(),
                        FirstName = "FirstName",
                        LastName = "LastName",
                        Name = "Name",
                        Email = "email@mail.com",
                        Phone = "(727) 539-7429",
                        Customers = new List<string>()
                        {
                            "customer1",
                            "customer2",
                            "customer3",
                        },
                        AccessToken = "AccessToken",
                        RefreshToken = "RefreshToken",
                        ExpiresInSeconds = 32,
                        AccessTokenIssuanceTimestampUtc = 32
                    });

                    return x;
                });
        }
    }

    public class UIFixture : TestServerFixture<Startup, UISetup>
    { }
}
