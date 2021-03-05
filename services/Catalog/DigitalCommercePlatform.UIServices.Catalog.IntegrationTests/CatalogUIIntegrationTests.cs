using DigitalCommercePlatform.UIService.Catalog;
using DigitalCommercePlatform.UIService.Catalog.Actions;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using System;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using FluentAssertions;

namespace DigitalCommercePlatform.UIServices.Catalog.IntegrationTests
{
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
        [InlineData("/v1/id?id=14")]
        public async Task UI_GetMultiple_SingleId_ReturnsData(string input)
        {
            using var scope = fixture.CreateChildScope()
                .OverrideClient<IMiddleTierHttpClient>()
                .MatchContains("Id=14")
                .Returns(new GetMultipleCatalogHierarchy.Response())
                .Build();

            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetMultipleCatalogHierarchy.Response>(
                c => c.GetAsync(new Uri(input, UriKind.Relative))).ConfigureAwait(false);
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("/v1/id?id=14&id=28")]
        public async Task UI_GetMultiple_MultipleIds_ReturnsData(string input)
        {
            using var scope = fixture.CreateChildScope()
                .OverrideClient<IMiddleTierHttpClient>()
                .MatchContains("Id=14&Id=28")
                .Returns(new GetMultipleCatalogHierarchy.Response())
                .Build();

            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest<GetMultipleCatalogHierarchy.Response>(
                c => c.GetAsync(new Uri(input, UriKind.Relative))).ConfigureAwait(false);
            response.Should().NotBeNull();
        }

        [Theory]
        [InlineData("/v1/id?")]
        public async Task UI_GetMultiple_MissingId_ReturnsData(string input)
        {
            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await client.RunTest(
                c => c.GetAsync(new Uri(input, UriKind.Relative)),
                System.Net.HttpStatusCode.BadRequest).ConfigureAwait(false);
            response.Content.ReadAsStringAsync().Result.Should().Contain("'Id' must not be empty.");
        }
    }
}