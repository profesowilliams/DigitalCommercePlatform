//using DigitalCommercePlatform.UIService.Order.Actions.Order.GetOrder;
//using DigitalCommercePlatform.UIService.Order.Dto.SalesOrder;
//using DigitalCommercePlatform.UIService.Order.Models.SalesOrder;
//using DigitalFoundation.Common.Settings;
//using DigitalFoundation.Common.TestUtilities;
//using FluentAssertions;
//using Flurl;
//using Microsoft.Extensions.Options;
//using Moq;
//using System;
//using System.Threading;
//using System.Threading.Tasks;
//using Xunit;

//namespace DigitalCommercePlatform.UIService.Order.Tests.ActionTests
//{
//    public class GetOrderTests : HandlerTests<GetOrder.Handler>
//    {
//        private readonly string _testSource = "ActionTests/salesOrderDto.json";

//        [Trait("Category", "Exception Test")]
//        [Fact(DisplayName = "Create Get Order with null-mapper")]
//        public void CreateHandlerNullMapperTest()
//        {
//            Action action = () => _ = new GetOrder.Handler(null,
//                loggerMock.Object,
//                middleTierHttpClientMock.Object,
//                options);

//            action.Should().Throw<ArgumentNullException>("mapper");
//        }

//        [Trait("Category", "Exception Test")]
//        [Fact(DisplayName = "Create Get Order with null-logger")]
//        public void CreateHandlerNullLoggerTest()
//        {
//            Action action = () => _ = new GetOrder.Handler(mapper,
//                null,
//                middleTierHttpClientMock.Object,
//                options);

//            action.Should().Throw<ArgumentNullException>("logger");
//        }

//        [Trait("Category", "Exception Test")]
//        [Fact(DisplayName = "Create Get Order with null-httpclient")]
//        public void CreateHandlerNullHttpClientTest()
//        {
//            Action action = () => _ = new GetOrder.Handler(mapper,
//                loggerMock.Object,
//                null,
//                options);

//            action.Should().Throw<ArgumentNullException>("client");
//        }

//        [Trait("Category", "Exception Test")]
//        [Fact(DisplayName = "Create Get Order with null-appOptions")]
//        public void CreateHandlerNullAppOptionsTest()
//        {
//            Action action = () => _ = new GetOrder.Handler(mapper,
//                loggerMock.Object,
//                middleTierHttpClientMock.Object,
//                null);

//            action.Should().Throw<ArgumentNullException>("options");
//        }

//        [Trait("Category", "Exception Test")]
//        [Fact(DisplayName = "Create Get Order Test with Invalid AppSettings")]
//        public void CreateHandlerAppSettingEmptyTest()
//        {
//            Action action = () => _ = new GetOrder.Handler(mapper,
//                loggerMock.Object,
//                middleTierHttpClientMock.Object,
//                new Mock<IOptions<AppSettings>>().Object);

//            action.Should().Throw<ArgumentNullException>();
//        }

//        [Trait("Category", "Set Object")]
//        [Fact(DisplayName = "Create Get Order Test")]
//        public void CreateHandlerSuccessfullTest()
//        {
//            var handler = new GetOrder.Handler(mapper,
//                loggerMock.Object,
//                middleTierHttpClientMock.Object,
//                options);

//            handler.Should().NotBeNull();
//            var result = GetPropertyAccessor(handler, "CoreOrder");

//            result.Should().NotBeNull().And.BeAssignableTo<string>();
//            result.As<string>().Should().Be(CoreOrderValue);
//        }

//        [Trait("Category", "Get Object")]
//        [Fact(DisplayName = "Build Url Test")]
//        public void GetUrlToCallServiceTest()
//        {
//            var id = "1234567";
//            var expected = $"{CoreOrderValue}/{AppConstants.SalesOrderSegment}/{id}";
//            var handler = new GetOrder.Handler(mapper,
//               loggerMock.Object,
//               middleTierHttpClientMock.Object,
//               options);

//            var result = typeof(GetOrder.Handler).GetMethodAccessor(handler, new object[] { id }, "GetUrl", null);

//            result.Should().NotBeNull().And.BeAssignableTo<Url>();
//            result.ToString().Should().Be(expected);
//        }

//        [Fact(DisplayName = "Execute Send Procedure Test")]
//        public async Task GetOrderHandlerSendTest()
//        {
//            var dto = GetObjectSource<SalesOrderDto>(_testSource);
//            dto.Should().NotBeNull("Object source have not been found");

//            middleTierHttpClientMock.Setup(p => p.GetAsync<SalesOrderDto>(It.IsAny<string>(), null, null))
//                .ReturnsAsync(dto);

//            var handler = new GetOrder.Handler(mapper,
//              loggerMock.Object,
//              middleTierHttpClientMock.Object,
//              options);

//            var result = await handler.Handle(new GetOrder.Request { Id = "12345" }, CancellationToken.None);

//            result.Should().NotBeNull().And.BeAssignableTo<SalesOrderModel>();
//            SourceTargetVerification(dto, result);
//        }
//    }
//}