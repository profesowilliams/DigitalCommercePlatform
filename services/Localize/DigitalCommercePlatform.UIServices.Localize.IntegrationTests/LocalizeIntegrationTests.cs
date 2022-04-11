//2022 (c) TD Synnex - All Rights Reserved.

using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Localize.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients(IStartupClientManager manager, string serviceName)
               => manager
                   .AddClient<ISimpleHttpClient>()
                       .MatchContains($"AppSetting/{serviceName}")
                    .Returns(Defaults.GetAppSettings()
                                .Extend("Core.Price.Url", "https://fakeurl.com/v1")
                                .Extend("Core.Security.Url", string.Empty)
                                .Extend("UI.Security.CorsAllowedOrigin", "true")
                                .Extend("UI.Security.CorsAllowedHeaders", "true")
                                .Extend("UI.Security.CorsAllowedMethods", "true")
                                .Extend("MaxPageSize", "100")
                                .Extend("Core.Localization.Url", "https://fakeurl.com/v1"))
                       .MatchContains($"/Data/{serviceName}")
                       .Returns<Dictionary<string, string>>()
                       .MatchContains($"SiteSetting/{serviceName}")
                       .Returns(Defaults.GetSiteSettings())
                   .Build()
                   .AddClient<IMiddleTierHttpClient>()
                   .Build();

        public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
            => serviceDescriptors.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
    }

    public class UIFixture : TestServerFixture<Startup, UISetup>
    { }

    public class SearchUIIntegrationTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public SearchUIIntegrationTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }
    }
}