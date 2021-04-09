using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Services.Contracts;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.ActionTests
{
    public class GetOrderLinesQueryHandlerTests : BaseTest
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create GetOrderLinesQueryHandler with null OrderQueryServices")]
        public void CreateHandlerNullOrderQueryServicesTest()
        {
            Action action = () => _ = new GetOrderLinesQueryHandler(null,GetMapper());
            action.Should().Throw<ArgumentNullException>("orderQueryServices");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create GetOrderLinesQueryHandler with null Mapper")]
        public void CreateHandlerNullMapperTest()
        {
            var orderQueryServiceMock = new Mock<IOrderQueryServices>();

            Action action = () => _ = new GetOrderLinesQueryHandler(orderQueryServiceMock.Object, null);
            action.Should().Throw<ArgumentNullException>("mapper");
        }


        [Fact(DisplayName = "Response is returned when model is available")]
        public async Task ResponseIsReturnedWhenModelIsAvailable()
        {
            var orderQueryServiceMock = new Mock<IOrderQueryServices>();

            var orderModel = new OrderModel
            {
                Created = new DateTime(2020, 12, 28),
                Currency = "CAD",
                DocType = "ZOR",
                Price = 1856.20M,
                ShipTo = new AddressModel { Name = "sharvari bhandare" },
                Source = new Source { ID = "726935" },
                Status = Status.PROCESSING,
                Items = new List<Item>()
                {
                    new Item { ID = "1" },
                    new Item { ID = "2" }
                }
            };

            orderQueryServiceMock.Setup(x => x.GetOrderByIdAsync(It.IsAny<string>())).ReturnsAsync(orderModel);
            var sut = new GetOrderLinesQueryHandler(orderQueryServiceMock.Object, GetMapper());
            
            var result = await sut.Handle(new GetOrderLinesQuery("1"), CancellationToken.None);
            result.Should().NotBeNull().And.BeAssignableTo<IEnumerable<OrderLineResponse>>();
        }

        [Fact(DisplayName = "Null is returned when model is not available")]
        public async Task NullIsReturnedWhenModelIsNotAvailable()
        {
            var orderQueryServiceMock = new Mock<IOrderQueryServices>();

            orderQueryServiceMock.Setup(x => x.GetOrderByIdAsync(It.IsAny<string>())).Returns(Task.FromResult<OrderModel>(null));
            var sut = new GetOrderLinesQueryHandler(orderQueryServiceMock.Object, GetMapper());

            var result = await sut.Handle(new GetOrderLinesQuery("1"), CancellationToken.None);
            result.Should().BeNull();
        }
    }
}
