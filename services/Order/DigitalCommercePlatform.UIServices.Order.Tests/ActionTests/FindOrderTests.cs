using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailstoFindOrder;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.ActionTests
{
    public class FindOrderTests : BaseTest
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Find Order with null-logger")]
        public void CreateHandlerNullMapperTest()
        {
            Action action = () => _ = new FindOrder.Handler(
                GetMiddleTierHttpClientMock().Object,
                null);

            action.Should().Throw<ArgumentNullException>("mapper");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Find Order with null-httpclient")]
        public void CreateHandlerNullHttpClientTest()
        {
            Action action = () => _ = new FindOrder.Handler(null,
                GetLoggerMock<FindOrder.Handler>().Object);

            action.Should().Throw<ArgumentNullException>("client");
        }

        [Trait("Category", "Set Object")]
        [Fact(DisplayName = "Create Find Order Test")]
        public void CreateHandlerSuccessfullTest()
        {
            var handler = new FindOrder.Handler(
                GetMiddleTierHttpClientMock().Object,
                GetLoggerMock<FindOrder.Handler>().Object);

            handler.Should().NotBeNull();
            var result = typeof(FindOrder.Handler).GetFieldAccessor(handler, "_AppOrderUrl", out Type type);

            type.Should().NotBeNull().And.Be(typeof(string));
            result.Should().NotBeNull().And.BeAssignableTo<string>();
            result.As<string>().Should().NotBeNullOrEmpty();
        }
    }
}