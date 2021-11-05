//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions
{
    public class GetOrdersTest
    {
        private readonly Mock<ISortingService> _mockSortingService;
        private readonly Mock<IStatusMappingService> _mockStatusMappingService;
        private readonly Mock<IOrderService> _mockOrderService;
        private readonly Mock<IMapper> _mapper;

        public GetOrdersTest()
        {
            _mockOrderService = new();
            _mockSortingService = new();
            _mockStatusMappingService = new();
            _mapper = new Mock<IMapper>();
        }

        [AutoDomainData]
        public async Task GetOrdersDetails(OrdersContainer expected)
        {
            _mockOrderService.Setup(x => x.GetOrdersAsync(
                      It.IsAny<SearchCriteria>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new GetOrders.GetOrderHandler(_mockOrderService.Object, _mockSortingService.Object, _mockStatusMappingService.Object, _mapper.Object);
            var PagingDTO = new GetOrders.PagingDto("","",1,1,true);
            var FilteringDTO = new GetOrders.FilteringDto("","","",null,null,"","","","");
            var request = new GetOrders.Request(FilteringDTO,PagingDTO);
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }

    }
}
