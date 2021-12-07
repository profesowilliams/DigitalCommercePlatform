//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Actions.GetUser;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Account.IntegrationTests
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

    public class UIFixture : TestServerFixture<Startup, UISetup>
    { }

    public class CatalogUIIntegrationTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public CatalogUIIntegrationTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }

        //[Theory]
        //[InlineData("/v1/GetUser/adobeEM")]
        //public async Task UI_GetUser_ReturnsData(string input)
        //{
        //    var client = fixture.CreateClient().SetDefaultHeaders();
        //    var response = await client.RunTest<GetUser.Response>(
        //        c => c.GetAsync(new Uri(input, UriKind.Relative))).ConfigureAwait(false);
        //    response.Should().NotBeNull();
        //}

        //[Theory]
        //[AutoDomainData]
        //public async Task UI_GetUser_Login_ReturnsData(Authenticate authenticate)
        //{
        //    var input = "/login";
        //    var client = fixture.CreateClient().SetDefaultHeaders();

        //    using var content = new StringContent(JsonConvert.SerializeObject(authenticate), Encoding.UTF8, "application/json");
        //    var response = await client.RunTest<GetUser.Response>(
        //        c => c.PostAsync(new Uri(input, UriKind.Relative), content)).ConfigureAwait(false);
        //    response.Should().NotBeNull();
        //}
    }
}
