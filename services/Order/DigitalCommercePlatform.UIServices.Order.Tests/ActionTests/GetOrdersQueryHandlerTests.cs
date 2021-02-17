using DigitalCommercePlatform.UIService.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIService.Order.Models.Order;
using DigitalCommercePlatform.UIService.Order.Services.Contracts;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.ActionTests
{
    public class GetOrdersQueryHandlerTests : BaseTest
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create GetOrdersQueryHandler with null OrderQueryServices")]
        public void CreateHandlerNullOrderQueryServicesTest()
        {
            var sortingServiceMock = new Mock<ISortingService>();

            Action action = () => _ = new GetOrdersQueryHandler(null,sortingServiceMock.Object ,GetMapper());
            action.Should().Throw<ArgumentNullException>("orderQueryServices");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create GetOrdersQueryHandler with null SortingService")]
        public void CreateHandlerNullSortingServiceTest()
        {
            var orderQueryServicesMock = new Mock<IOrderQueryServices>();

            Action action = () => _ = new GetOrdersQueryHandler(orderQueryServicesMock.Object, null, GetMapper());
            action.Should().Throw<ArgumentNullException>("sortingService");
        }

        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Create GetOrdersQueryHandler with null Mapper")]
        public void CreateHandlerNullMapperTest()
        {
            var sortingServiceMock = new Mock<ISortingService>();
            var orderQueryServicesMock = new Mock<IOrderQueryServices>();

            Action action = () => _ = new GetOrdersQueryHandler(orderQueryServicesMock.Object, sortingServiceMock.Object, null);
            action.Should().Throw<ArgumentNullException>("mapper");
        }

        [Fact(DisplayName = "Response is returned when model is available")]
        public async Task ResponseIsReturnedWhenModelIsAvailable()
        {
            var orderQueryServiceMock = new Mock<IOrderQueryServices>();
            var sortingServiceMock = new Mock<ISortingService>();

            var orderModel = new OrderModel
            {
                Created = new DateTime(2020, 12, 28),
                Currency = "CAD",
                DocType = "ZOR",
                Price = 1856.20M,
                ShipTo = new Address { Name = "sharvari bhandare" },
                Source = new Source { ID = "726935" },
                Status = Status.PROCESSING,
                Items = new List<Item>()
                {
                    new Item { ID = "1" },
                    new Item { ID = "2" }
                }
            };

            var ordersContainer = new OrdersContainer { Data = new List<OrderModel>() { orderModel } };

            orderQueryServiceMock.Setup(x => x.GetOrdersAsync(It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<int>(), It.IsAny<int>())).ReturnsAsync(ordersContainer);
            var sut = new GetOrdersQueryHandler(orderQueryServiceMock.Object,sortingServiceMock.Object, GetMapper());

            var result = await sut.Handle(new GetOrdersQuery("id",1,1), CancellationToken.None);
            result.Should().NotBeNull().And.BeAssignableTo<OrderResponse>();
        }
    }
}
