//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.IntegrationTestUtilities;
using DigitalFoundation.Common.IntegrationTestUtilities.Extensions;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentAssertions;
using System;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using GRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.IntegrationTests.GetDeals
{
    public class GetDealsTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public GetDealsTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }

        [Fact]
        public async Task GetDealsShouldReturnNoException()
        {
            using var scope = fixture.CreateChildScope();
            var input = "v1/deals/?SortDirection=asc";
            scope.OverrideClient<object>()
                .MatchContains(input)
                .Returns<ResponseBase<GRD.GetDeals.Response>>();

            var client = fixture.CreateClient().SetDefaultHeaders();
            var response = await Record.ExceptionAsync(async () => await client.RunTest<ResponseBase<GRD.GetDeals.Response>>(c =>
                c.GetAsync(new Uri(input, UriKind.Relative)))
            );

            response.Should().BeNull();
        }
    }
}
