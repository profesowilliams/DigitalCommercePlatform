//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.IntegrationTestUtilities;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.Config.IntegrationTests.GetDeals
{
    public class GetRenewalsTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public GetRenewalsTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }

        //[Fact]
        //public async Task GetDealsShouldReturnNoException()
        //{
        //    using var scope = fixture.CreateChildScope();
        //    var input = "v1/deals/?SortDirection=asc";
        //    scope.OverrideClient<object>()
        //        .MatchContains(input)
        //        .Returns<ResponseBase<GRD.GetRenewal.Response>>();

        //    var client = fixture.CreateClient().SetDefaultHeaders();
        //    var response = await Record.ExceptionAsync(async () => await client.RunTest<ResponseBase<GRD.GetRenewal.Response>>(c =>
        //        c.GetAsync(new Uri(input, UriKind.Relative)))
        //    );

        //    response.Should().BeNull();
        //}
    }
}
