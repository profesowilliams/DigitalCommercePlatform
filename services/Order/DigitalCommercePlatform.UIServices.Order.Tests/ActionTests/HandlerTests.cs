using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Infrastructure.Contracts;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Reflection;

namespace DigitalCommercePlatform.UIServices.Order.Tests.ActionTests
{
    public class HandlerTests<T>
    {
        protected readonly IMapper mapper;
        protected readonly Mock<ILogger<T>> loggerMock;
        protected readonly Mock<IMiddleTierHttpClient> middleTierHttpClientMock;
        protected readonly IOptions<AppSettings> options;

        protected readonly string CoreOrderValue = "Test Core Order Value";

        public HandlerTests()
        {
            var mapperCfg = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<OrderProfile>();
            });

            mapper = mapperCfg.CreateMapper();
            loggerMock = new Mock<ILogger<T>>();
            middleTierHttpClientMock = new Mock<IMiddleTierHttpClient>();
            options = GetAppOptions();
        }

        private IOptions<AppSettings> GetAppOptions()
        {
            AppSettings settings = new AppSettings();
            settings.Configure(new Dictionary<string, string>
            {
                [AppConstants.CoreOrderKey] = CoreOrderValue
            });

            return Options.Create<AppSettings>(settings);
        }

        protected object GetPropertyAccessor(object instance, string memberName)
        {
            var pis = instance.GetType().GetProperty(memberName, BindingFlags.NonPublic | BindingFlags.Instance);
            return pis is null ? null : pis.GetValue(instance);
        }
    }
}