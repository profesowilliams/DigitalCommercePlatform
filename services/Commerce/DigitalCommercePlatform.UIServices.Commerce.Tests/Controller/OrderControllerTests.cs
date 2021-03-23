using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Controllers;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Controller
{
    public class OrderControllerTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<OrderController>> _logger;
        private readonly Mock<IOptions<AppSettings>> _optionsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public OrderControllerTests()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            _context = new Mock<IUIContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<OrderController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _optionsMock.Setup(s => s.Value).Returns(appSettings);
            _siteSettings = new Mock<ISiteSettings>();
        }

        private OrderController GetController()
        {
            return new OrderController(_mediator.Object, _logger.Object, _context.Object, _optionsMock.Object, _siteSettings.Object);
        }

        [Theory]
        [AutoMoqData]
        public async Task GetOrderDetails(GetOrder.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetOrder.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderDetailsAsync("645665656565", new Infrastructure.RequestHeaders());

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetRecentOrders(GetOrders.Response expected)
        {
            var criteria = new GetOrdersDto
            {
                Id = "I34534599",
                Reseller = "SHI",
                CreatedFrom = DateTime.Now.AddMonths(-6),
                CreatedTo = DateTime.Now,
                OrderBy = "Id",
                SortAscending = false,
                PageNumber = 1,
                PageSize = 25,
            };
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetOrders.Request>(),
                               It.IsAny<CancellationToken>()))
                           .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetRecentOrdersAsync(criteria, new Infrastructure.RequestHeaders());

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetOrderLinesAsync(GetLines.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetLines.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderLinesAsync("645665656565", new Infrastructure.RequestHeaders());

            result.Should().NotBeNull();
        }
    }
}
