using DigitalCommercePlatform.UIServices.Order.Actions.Order;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.ActionTests
{
    public class GetOrderByCustomerIdTests : HandlerTests<GetOrderByCustomerId.Handler>
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order by Customer Id with null-mapper")]
        public void CreateHandlerNullMapperTest()
        {
            Action action = () => _ = new GetOrderByCustomerId.Handler(null,
                loggerMock.Object,
                middleTierHttpClientMock.Object,
                options);

            action.Should().Throw<ArgumentNullException>("mapper");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order by Customer Id with null-logger")]
        public void CreateHandlerNullLoggerTest()
        {
            Action action = () => _ = new GetOrderByCustomerId.Handler(mapper,
                null,
                middleTierHttpClientMock.Object,
                options);

            action.Should().Throw<ArgumentNullException>("logger");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order by Customer Id with null-httpclient")]
        public void CreateHandlerNullHttpClientTest()
        {
            Action action = () => _ = new GetOrderByCustomerId.Handler(mapper,
                loggerMock.Object,
                null,
                options);

            action.Should().Throw<ArgumentNullException>("client");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order by Customer Id with null-appOptions")]
        public void CreateHandlerNullAppOptionsTest()
        {
            Action action = () => _ = new GetOrderByCustomerId.Handler(mapper,
                loggerMock.Object,
                middleTierHttpClientMock.Object,
                null);

            action.Should().Throw<ArgumentNullException>("options");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create Get Order by Customer Id with Invalid AppSettings")]
        public void CreateHandlerAppSettingEmptyTest()
        {
            Action action = () => _ = new GetOrderByCustomerId.Handler(mapper,
                loggerMock.Object,
                middleTierHttpClientMock.Object,
                new Mock<IOptions<AppSettings>>().Object);

            action.Should().Throw<ArgumentNullException>();
        }

        [Trait("Category", "Set Object")]
        [Fact(DisplayName = "Create Get Order by Customer Id Test")]
        public void CreateHandlerSuccessfullTest()
        {
            var handler = new GetOrderByCustomerId.Handler(mapper,
                loggerMock.Object,
                middleTierHttpClientMock.Object,
                options);

            handler.Should().NotBeNull();
            var result = GetPropertyAccessor(handler, "CoreOrder");

            result.Should().NotBeNull().And.BeAssignableTo<string>();
            result.As<string>().Should().Be(CoreOrderValue);
        }
    }
}