using DigitalCommercePlatform.UIService.Order.Actions.Order.DetailstoFindOrder;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.ActionTests
{
    public class FindSummaryOrderTests : BaseTest
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Find Summary Order with null-logger")]
        public void CreateHandlerNullMapperTest()
        {
            Action action = () => _ = new FindSummaryOrder.Handler(
                GetMiddleTierHttpClientMock().Object,
                null);

            action.Should().Throw<ArgumentNullException>("mapper");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Find FindSummaryOrder Order with null-httpclient")]
        public void CreateHandlerNullHttpClientTest()
        {
            Action action = () => _ = new FindSummaryOrder.Handler(null,
                GetLoggerMock<FindSummaryOrder.Handler>().Object);

            action.Should().Throw<ArgumentNullException>("client");
        }

        [Trait("Category", "Set Object")]
        [Fact(DisplayName = "Create Find FindSummaryOrder Order Test")]
        public void CreateHandlerSuccessfullTest()
        {
            var handler = new FindSummaryOrder.Handler(
                GetMiddleTierHttpClientMock().Object,
                GetLoggerMock<FindSummaryOrder.Handler>().Object);

            handler.Should().NotBeNull();
            var result = typeof(FindSummaryOrder.Handler).GetFieldAccessor(handler, "_AppOrderUrl", out Type type);

            type.Should().NotBeNull().And.Be(typeof(string));
            result.Should().NotBeNull().And.BeAssignableTo<string>();
            result.As<string>().Should().NotBeNullOrEmpty();
        }
    }
}