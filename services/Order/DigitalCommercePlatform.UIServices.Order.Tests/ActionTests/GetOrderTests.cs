using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofOrder;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.ActionTests
{
    public class GetOrderTests : BaseTest
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order with null-logger")]
        public void CreateHandlerNullLoggerTest()
        {
            Action action = () => _ = new GetOrder.Handler(
                GetMiddleTierHttpClientMock().Object,
                null);

            action.Should().Throw<ArgumentNullException>("logger");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order with null-httpclient")]
        public void CreateHandlerNullHttpClientTest()
        {
            Action action = () => _ = new GetOrder.Handler(
                null,
                GetLoggerMock<GetOrder>().Object);

            action.Should().Throw<ArgumentNullException>("client");
        }

        [Trait("Category", "Set Object")]
        [Fact(DisplayName = "Create Get Order Test")]
        public void CreateHandlerSuccessfullTest()
        {
            var handler = new GetOrder.Handler(
                GetMiddleTierHttpClientMock().Object,
                GetLoggerMock<GetOrder>().Object);

            handler.Should().NotBeNull();
            var result = typeof(GetOrder.Handler).GetFieldAccessor(handler, "_AppOrderUrl", out Type type);

            type.Should().NotBeNull().And.Be(typeof(string));
            result.Should().NotBeNull().And.BeAssignableTo<string>();
            result.As<string>().Should().NotBeNullOrEmpty();
        }
    }
}