//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Moq;

namespace DigitalCommercePlatform.UIServices.Order.IntegrationTests.Service
{
    public class OrderServiceTest
    {
        private static IMapper Mapper => new MapperConfiguration(config => config.AddProfile(new NuanceWebChatProfile())).CreateMapper();
        private static Mock<ILogger<OrderService>> Logger => new();
        private static Mock<IAppSettings> AppSettings
        {
            get
            {
                var moq = new Mock<IAppSettings>();

                moq.Setup(x => x.GetSetting("App.Renewal.Url")).Returns("http://appConfigUrl/v1/");
                moq.Setup(x => x.GetSetting("App.Quote.Url")).Returns("http://appquoteUrl/v1/");

                return moq;
            }
        }
    }
}
