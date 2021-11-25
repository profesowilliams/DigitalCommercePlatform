//2021 (c) Tech Data Corporation - All Rights Reserved.
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.IntegrationTests.Actions
{
    public class OrderTest
    {
        public OrderTest()
        {
            Init();
        }
        private static Mock<ILogger<GetOrder>> Logger => new();
        private static IMapper mapper;

        private static IMapper GetMapper()
        {
            return mapper;
        }

        private static void SetMapper(IMapper value)
        {
            mapper = value;
        }

        private static void Init()
        {
            var config = new MapperConfiguration(cfg =>
            {

                cfg.AddProfile(new NuanceWebChatProfile());
                cfg.AddProfile(new OrderProfile());

            });

            SetMapper(config.CreateMapper());
        }
        [Theory]
        [AutoDomainData]
        public async Task SearchDetailedHandler_Handle_ReturnDataAndPaginationInfo(GetOrder.Request request, OrderModel dtos)
        {
            // arrange
            var _service = new Mock<IOrderService>();
            
            _service.Setup(x => x.GetOrders(It.IsAny<NuanceWebChatRequest>())).ReturnsAsync(dtos);

            var handler = new GetOrder.Handler(_service.Object,GetMapper(), Logger.Object);

            // act
            var result = await handler.Handle(request, new CancellationToken());

            // assert
            result.Should().NotBeNull();
        }
    }
}
