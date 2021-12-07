//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto;
using DigitalCommercePlatform.UIServices.Order.Dto.Order;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.IntegrationTests.Service
{
    public static class OrderServiceTest
    {
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

        private static Mock<ILogger<OrderService>> Logger => new();
        private static Mock<IAppSettings> AppSettings
        {
            get
            {
                var moq = new Mock<IAppSettings>();
                moq.Setup(x => x.GetSetting("App.Order.Url")).Returns("http://appquoteUrl/v1/");

                return moq;
            }
        }
        [Theory]
        [AutoDomainData]
        public static void ServicesGetOrderTests(NuanceWebChatRequest request)
        {
            Init();
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDto>(It.IsAny<string>(), null, null, null)).ReturnsAsync(ReturnedData);

            var service = new OrderService(httpClient.Object, Logger.Object, AppSettings.Object, GetMapper());
            var result = service.GetOrders(request).Result;

            result.Should().NotBeNull();
        }
        [Theory]
        [AutoDomainData]
        public static void ThrowsExceptionOtherThanRemoteServerHttpException(NuanceWebChatRequest request)
        {
            //arrange
            Init();
            var httpClient = new Mock<IMiddleTierHttpClient>();

            httpClient.Setup(x => x.GetAsync<ResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), It.IsAny<IDictionary<string, string>>()))
                .ThrowsAsync(new Exception("test 123"));

            var service = new OrderService(httpClient.Object, Logger.Object, AppSettings.Object, GetMapper());

            //act
            Func<Task> act = async () => await service.GetOrders(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            httpClient.Verify(x => x.GetAsync<ResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), It.IsAny<IDictionary<string, string>>()), Times.Once);
        }

        private static ResponseDto ReturnedData()
        {
            return new ResponseDto()
            {
                Data = new List<OrderDto>()
                {
                    new OrderDto()
                    {
                        Creator = "Creator1"
                    }
                }
            };
        }
    }
}
