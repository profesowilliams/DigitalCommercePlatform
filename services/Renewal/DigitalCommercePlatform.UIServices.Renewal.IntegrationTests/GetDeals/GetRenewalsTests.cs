//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.IntegrationTests;
using DigitalFoundation.Common.IntegrationTestUtilities;
using Xunit;
using Xunit.Abstractions;

namespace DigitalCommercePlatform.UIServices.IntegrationTests.GetDeals
{
    public class GetRenewalsTests : IClassFixture<UIFixture>
    {
        private readonly UIFixture fixture;

        public GetRenewalsTests(UIFixture fixture, ITestOutputHelper output)
        {
            this.fixture = fixture;
            TestOutput.Output = output;
        }
    }
}