//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions
{
    public class GetOrdersTest
    {
        private readonly Mock<ISortingService> _mockSortingService;
        private readonly Mock<IStatusMappingService> _mockStatusMappingService;
        private readonly Mock<ICommerceService> _mockCommerceService;
        private readonly Mock<IMapper> _mapper;

        public GetOrdersTest()
        {
            _mockCommerceService = new();
            _mockSortingService = new();
            _mockStatusMappingService = new();
            _mapper = new Mock<IMapper>();
        }

        [AutoDomainData]
        public async Task GetOrdersDetails(OrdersContainer expected)
        {
            _mockCommerceService.Setup(x => x.GetOrdersAsync(
                      It.IsAny<SearchCriteria>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new GetOrders.GetOrderHandler(_mockCommerceService.Object, _mockSortingService.Object, _mockStatusMappingService.Object, _mapper.Object);
            var PagingDTO = new GetOrders.PagingDto("","",1,1,true);
            var FilteringDTO = new GetOrders.FilteringDto("","","",null,null,"","","","");
            var request = new GetOrders.Request(FilteringDTO,PagingDTO);
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}
