//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Config.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients(ITestHttpClientFactory factory, string serviceName)
               => factory
                   .AddClient<ISimpleHttpClient>()
                       .MatchContains($"AppSetting/{serviceName}")
                           .Returns(Defaults.GetAppSettings()
                                .Extend("UI.Security.CorsAllowedOrigin", "true")
                                .Extend("UI.Security.CorsAllowedHeaders", "true")
                                .Extend("UI.Security.CorsAllowedMethods", "true")
                                .Extend("MaxPageSize", "100"))
                       .MatchContains($"SiteSetting/{serviceName}")
                           .Returns(Defaults.GetSiteSettings())
                       .Build()
                   .AddClient<IMiddleTierHttpClient>()
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
                    x.SetUser(new DigitalFoundation.Common.Models.User
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
