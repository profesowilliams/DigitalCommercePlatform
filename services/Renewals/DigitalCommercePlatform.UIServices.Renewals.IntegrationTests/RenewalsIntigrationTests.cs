using DigitalCommercePlatform.UIServices.Renewals.Actions.GetSummary;
using DigitalCommercePlatform.UIServices.Renewals.Models;
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
using static DigitalCommercePlatform.UIServices.Renewals.Actions.GetSummary.GetRenewalsSummary;

namespace DigitalCommercePlatform.UIServices.Renewals.IntegrationTests
{

    public class RenewalsIntigrationTests
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
                            .Extend("Core.Order.Url", "http://order") //change Order to Core.Renewals.Url once site created
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
            [InlineData("v1/summary?days=0,30,60,90")]
            public async Task App_GetMultiple_ReturnsData(string input)
            {
                // Arrange
                var result = new RenewalsSummaryModel
                {
                    Today = 1,
                    ThirtyDays = 10,
                    SixtyDays = 35,
                    NinetyDays = 50,

                };

                using var scope = fixture.CreateChildScope();
                scope.OverrideClient<IMiddleTierHttpClient>()
                    .ForHttpMethod(HttpMethod.Get)
                    .MatchContains("/?days=0,30,60,90")
                    .Returns<GetRenewalsSummary.Response>(r => new GetRenewalsSummary.Response(result));

                var client = fixture.CreateClient().SetDefaultHeaders();
                var url = new Uri(client.BaseAddress + input);

                // Act
                var response = await client.RunTest(c => c.GetAsync(url), HttpStatusCode.OK).ConfigureAwait(false);
                // Assert
                response.StatusCode.Should().Be(HttpStatusCode.OK);
            }

        }
    }
}
