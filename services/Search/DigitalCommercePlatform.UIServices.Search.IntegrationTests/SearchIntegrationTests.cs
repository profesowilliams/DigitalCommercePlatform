//2022 (c) TD Synnex - All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Search.IntegrationTests
{
    //public class UISetup : Setup
    //{
    //    public override void AddClients(ITestHttpClientFactory factory, string serviceName)
    //           => factory
    //               .AddClient<ISimpleHttpClient>()
    //                   .MatchContains($"AppSetting/{serviceName}")
    //                .Returns(Defaults.GetAppSettings()
    //                            .Extend("Core.Price.Url", "https://fakeurl.com/v1")
    //                            .Extend("Core.Security.Url", string.Empty)
    //                            .Extend("UI.Security.CorsAllowedOrigin", "true")
    //                            .Extend("UI.Security.CorsAllowedHeaders", "true")
    //                            .Extend("UI.Security.CorsAllowedMethods", "true")
    //                            .Extend("MaxPageSize", "100")
    //                            .Extend("Core.Localization.Url", "https://fakeurl.com/v1"))
    //                   .MatchContains($"/Data/{serviceName}")
    //                   .Returns<Dictionary<string, string>>()
    //                   .MatchContains($"SiteSetting/{serviceName}")
    //                   .Returns(Defaults.GetSiteSettings())
    //               .Build()
    //               .AddClient<IMiddleTierHttpClient>()
    //               .Build();

    //    public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
    //        => serviceDescriptors.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
    //}

    //public class UIFixture : TestServerFixture<Startup, UISetup>
    //{ }

    //public class SearchUIIntegrationTests : IClassFixture<UIFixture>
    //{
    //    private readonly UIFixture fixture;

    //    public SearchUIIntegrationTests(UIFixture fixture, ITestOutputHelper output)
    //    {
    //        this.fixture = fixture;
    //        TestOutput.Output = output;
    //    }

    //    [Theory]
    //    [InlineData("v1/TypeAhead?SearchTerm=microso&Type=Product&MaxResults=10&MinResults=12&MinResults=2")]
    //    public async Task TypeAheadSearch(string input)
    //    {
    //        using var scope = fixture.CreateChildScope();
    //        scope.OverrideClient<object>()
    //            .MatchContains(input)
    //            .Returns<ResponseBase<TypeAhead.Response>>();
    //        var client = fixture.CreateClient().SetDefaultHeaders();
    //        var response = await client.RunTest<ResponseBase<TypeAhead.Response>>(c => c.GetAsync(new Uri(input, UriKind.Relative)));
    //        response.Should().NotBeNull();
    //    }
    //}
}