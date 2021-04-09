using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Catalog.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients([NotNull]ITestHttpClientFactory factory, string serviceName)
           => factory
               .AddClient<ISimpleHttpClient>()
                       .MatchContains($"AppSetting/{serviceName}")
                       .Returns(Defaults.GetAppSettings())
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
}