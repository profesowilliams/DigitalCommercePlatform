//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Common.Fixtures
{
    public class InitHandlerCommonPropertiesFixture
    {
        public readonly Mock<IMapper> MockMapper;
        public readonly NullLoggerFactory LoggerFactory;
        public readonly Mock<IOrderService> MockOrderService;

        public InitHandlerCommonPropertiesFixture()
        {
            LoggerFactory = new ();
            MockMapper = new();
            MockOrderService = new();
        }
    }
}
