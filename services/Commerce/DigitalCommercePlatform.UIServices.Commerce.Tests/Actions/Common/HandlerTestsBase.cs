//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Common.Fixtures;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Common
{
    [ExcludeFromCodeCoverage]
    public class HandlerTestsBase
    {
        protected readonly Mock<IMapper> _mockMapper;
        protected readonly Mock<ILogger<DownloadInvoice.Handler>> _loggerFactory;
        protected readonly Mock<IOrderService> _mockOrderService;

        public HandlerTestsBase(InitHandlerCommonPropertiesFixture fixture)
        {
            if (fixture is null)
            {
                throw new ArgumentNullException(nameof(fixture));
            }

            _loggerFactory = fixture.LoggerFactory;
            _mockMapper = fixture.MockMapper;
            _mockOrderService = fixture.MockOrderService;
        }
    }
}
