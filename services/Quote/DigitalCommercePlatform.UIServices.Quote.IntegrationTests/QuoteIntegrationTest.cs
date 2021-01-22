using DigitalCommercePlatform.UIServices.Quote.Actions.Quote;
using DigitalFoundation.AppServices.Quote.Models.Quote;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.IntegrationTestUtilities.Fakes;
using DigitalFoundation.Common.IntegrationTestUtilities.Interfaces;
using FluentAssertions;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Quote.IntegrationTests
{
    public class QuoteIntegrationTest
    {
        public class UISetup : Setup
        {
            public override void AddClients(ITestHttpClientFactory factory, string serviceName)
                => factory
                    .AddClient<ISimpleHttpClient>(name: "").Build()
                    .AddClient<ISimpleHttpClient>()
                        .MatchContains($"AppSetting/{serviceName}")
                        .Returns(Defaults.GetAppSettings()
                            .Extend("Core.Security.Url", "fakeUrl")
                            .Extend("Core.Quote.Url", "http://quote")
                            )
                        .MatchContains($"/Data/{serviceName}")
                        .Returns(new Dictionary<string, string>() { { string.Empty, string.Empty } })
                        .MatchContains($"SiteSetting/{serviceName}")
                        .Returns(Defaults.GetSiteSettings())
                    .Build()
                    .AddClient<IMiddleTierHttpClient>().Build();

            public override void PostStartupConfigureServices(IServiceCollection serviceDescriptors)
                => serviceDescriptors.AddSingleton<IPolicyEvaluator, FakePolicyEvaluator>();
        }

        public class Fixture : TestServerFixture<Startup, UISetup>
        {
        }

        public class QuoteAppServiceIntegrationTests : IClassFixture<Fixture>
        {
            private readonly Fixture fixture;

            public QuoteAppServiceIntegrationTests(Fixture fixture, ITestOutputHelper output)
            {
                this.fixture = fixture;
                TestOutput.Output = output;
            }

            [Theory]
            [InlineData("v1/?id=1")]
            public async Task App_Get_ReturnsData(string input)
            {
                // Arrange
                using var scope = fixture.CreateChildScope();
                scope.OverrideClient<IMiddleTierHttpClient>()
                    .ForHttpMethod(HttpMethod.Get)
                    .MatchContains("/?Ids=1&Details=True")
                    .Returns<GetQuoteHandler.Response>(r => new GetQuoteHandler.Response(new List<QuoteModel>() { new QuoteModel() { Creator = "2", EndUserPO = "test" } }));

                var client = fixture.CreateClient().SetDefaultHeaders();
                var url = new Uri(client.BaseAddress + input);

                // Act
                var response = await client.RunTest(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
            }


            [Theory]
            [InlineData("v1/?id=1")]
            public async Task App_GetMultiple_ReturnsData(string input)
            {
                // Arrange
                using var scope = fixture.CreateChildScope();
                scope.OverrideClient<IMiddleTierHttpClient>()
                    .ForHttpMethod(HttpMethod.Get)
                    .MatchContains("/?Ids=1&Details=True")
                    .Returns<GetQuotesHandler.Response>(new GetQuotesHandler.Response(new List<QuoteModel>()
                                {new QuoteModel() {Creator = "2", EndUserPO = "test"}})
                    );

                var client = fixture.CreateClient().SetDefaultHeaders();
                var url = new Uri(client.BaseAddress + input);

                // Act
                var response = await client.RunTest(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);
                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
            }

            [Theory]
            [InlineData("v1/?id=1")]
            public async Task App_Search_ReturnsData(string input)
            {
                // Arrange
                using var scope = fixture.CreateChildScope();
                scope.OverrideClient<IMiddleTierHttpClient>()
                    .ForHttpMethod(HttpMethod.Get)
                    .MatchContains("/?Ids=1&Details=True")
                    .Returns<SearchQuoteHandler.Response>(r => new SearchQuoteHandler.Response(new List<QuoteModel>() { new QuoteModel() { Creator = "2", EndUserPO = "test" } }));

                var client = fixture.CreateClient().SetDefaultHeaders();
                var url = new Uri(client.BaseAddress + input);

                // Act
                var response = await client.RunTest(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
            }


            [Theory]
            [InlineData("v1/Find?Id=1")]
            public async Task App_FindWithoutDetails_ReturnsData(string input)
            {
                // Arrange
                using var scope = fixture.CreateChildScope();
                scope.OverrideClient<IMiddleTierHttpClient>()
                    .ForHttpMethod(HttpMethod.Get)
                    .MatchContains("Find")
                    .Returns<SearchQuoteHandler.Response>(r =>
                    {
                        return new SearchQuoteHandler.Response(new List<QuoteModel> { new QuoteModel { CustomerPO = "Test2" } });
                    });

                var client = fixture.CreateClient().SetDefaultHeaders();
                var url = new Uri(client.BaseAddress + input);

                // Act
                var response = await client.RunTest<SearchQuoteHandler.Response>(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);

                // Assert
                response.Content.Should().BeAssignableTo<IEnumerable<QuoteModel>>();
                response.ErrorCode.Should().BeNullOrEmpty();
            }
        }
    }
}
