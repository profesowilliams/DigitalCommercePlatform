//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Content.Actions.ReplaceCartQuotes;
using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Content.IntegrationTests
{
    public class UISetup : Setup
    {
        public override void AddClients(ITestHttpClientFactory factory, string serviceName)
               => factory
                   .AddClient<ISimpleHttpClient>()
                       .MatchContains($"AppSetting/{serviceName}")
                    .Returns(Defaults.GetAppSettings()
                                .Extend("Core.Price.Url", "https://fakeurl.com/v1")
                                .Extend("Core.Security.Url", string.Empty)
                                .Extend("UI.Security.CorsAllowedOrigin", "true")
                                .Extend("UI.Security.CorsAllowedHeaders", "true")
                                .Extend("UI.Security.CorsAllowedMethods", "true")
                                .Extend("MaxPageSize", "100"))
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

        [Theory]
        [InlineData("v1/savedCart?id=123&isCartName=false")]
        public async Task GetSavedCartDetails(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<ResponseBase<GetSavedCartDetails.Response>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetSavedCartDetails.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/Search?searchTerm=shop&maxResults=21")]
        public async Task TypeAheadSearch(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<ResponseBase<TypeAheadSearch.Response>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<TypeAheadSearch.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/activeCart")]
        public async Task GetActiveCartDetails(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<ResponseBase<GetActiveCart.Request>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<GetActiveCart.Request>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("v1/replaceCart?type=quote&id=1234")]
        public async Task ReplaceCart(string input)
        {
            using var scope = fixture.CreateChildScope();
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<ResponseBase<ReplaceCart.Request>>();
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<ResponseBase<ReplaceCart.Request>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
            response.Should().BeNull();
        }
    }
}
