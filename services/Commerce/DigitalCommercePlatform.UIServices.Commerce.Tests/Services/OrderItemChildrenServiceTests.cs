//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class OrderItemChildrenServiceTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<HelperService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        public OrderItemChildrenServiceTests()
        {
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<HelperService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
        }

        [Fact(DisplayName = "Lines are empty for invalid input")]
        public void LinesAreEmptyForInvalidInput()
        {
            var substringService = new SubstringService();
            HelperService helperService = new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object);
            var sut = new OrderItemChildrenService(substringService, helperService);
            var result = sut.GetOrderLinesWithChildren(null);

            Assert.Empty(result);
        }

        [Fact(DisplayName = "Children lines are generated")]
        public void ChildrenLinesAreGenerated()
        {
            var substringService = new SubstringService();
            HelperService helperService = new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object);
            var sut = new OrderItemChildrenService(substringService, helperService);
            var orderModel = new OrderDetailModel
            {

                Lines = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = "0" },
                        new Models.Line { Id = "1.1", Parent = "3232" },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = "0" },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }
            };
            var orderPreviewModel = new GetOrder.Response(orderModel);


            var result = sut.GetOrderLinesWithChildren(orderPreviewModel);

            Assert.Equal(2, result.Count);
        }
    }
}
