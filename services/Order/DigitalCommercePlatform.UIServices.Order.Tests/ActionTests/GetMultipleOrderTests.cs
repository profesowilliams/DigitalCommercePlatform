using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofMultipleOrder;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.ActionTests
{
    public class GetMultipleOrderTests : BaseTest
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Find Multiple Order with null-logger")]
        public void CreateHandlerNullMapperTest()
        {
            Action action = () => _ = new GetMultipleOrders.Handler(
                GetMiddleTierHttpClientMock().Object,
                null);

            action.Should().Throw<ArgumentNullException>("mapper");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Find Multiple Order with null-httpclient")]
        public void CreateHandlerNullHttpClientTest()
        {
            Action action = () => _ = new GetMultipleOrders.Handler(null,
                GetLoggerMock<GetMultipleOrders>().Object);

            action.Should().Throw<ArgumentNullException>("client");
        }

        [Trait("Category", "Set Object")]
        [Fact(DisplayName = "Create Find Multiple Order Test")]
        public void CreateHandlerSuccessfullTest()
        {
            var handler = new GetMultipleOrders.Handler(
                GetMiddleTierHttpClientMock().Object,
                GetLoggerMock<GetMultipleOrders>().Object);

            handler.Should().NotBeNull();
            var result = typeof(GetMultipleOrders.Handler).GetFieldAccessor(handler, "_appOrderUrl", out Type type);

            type.Should().NotBeNull().And.Be(typeof(string));
            result.Should().NotBeNull().And.BeAssignableTo<string>();
            result.As<string>().Should().NotBeNullOrEmpty();
        }
    }
}