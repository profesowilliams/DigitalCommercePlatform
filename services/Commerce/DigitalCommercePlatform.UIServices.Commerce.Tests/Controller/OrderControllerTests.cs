using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetRecentOrders;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Order;
using DigitalCommercePlatform.UIServices.Commerce.Controllers;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Net;
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
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public OrderControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _context = new Mock<IUIContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<OrderController>>();
            _siteSettings = new Mock<ISiteSettings>();
        }

        private OrderController GetController()
        {
            return new OrderController(_mediator.Object, _logger.Object, _context.Object, _appSettingsMock.Object, _siteSettings.Object);
        }

        [Theory]
        [AutoMoqData]
        public async Task GetOrderDetails(ResponseBase<GetOrder.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetOrder.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderDetailsAsync("645665656565");

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetOrderDetails_BadRequest(ResponseBase<GetOrder.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetOrder.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderDetailsAsync("645665656565") as ObjectResult;

            var statusCode = (HttpStatusCode)result.StatusCode;

            statusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoMoqData]
        public async Task GetRecentOrders(ResponseBase<GetOrders.Response> expected)
        {
            var criteria = new GetOrdersDto
            {
                Id = "I34534599",
                Reseller = "SHI",
                CreatedFrom = DateTime.Now.AddMonths(-6),
                CreatedTo = DateTime.Now,
                SortBy = "Id",
                SortDirection = "asc",
                PageNumber = 1,
                PageSize = 25,
            };
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetOrders.Request>(),
                               It.IsAny<CancellationToken>()))
                           .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetRecentOrdersAsync(criteria);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetRecentOrders_BadRequest(ResponseBase<GetOrders.Response> expected)
        {
            var criteria = new GetOrdersDto
            {
                Id = "I34534599",
                Reseller = "SHI",
                CreatedFrom = DateTime.Now.AddMonths(-6),
                CreatedTo = DateTime.Now,
                SortBy = "Id",
                SortDirection = "asc",
                PageNumber = 1,
                PageSize = 25,
            };
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetOrders.Request>(),
                               It.IsAny<CancellationToken>()))
                           .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetRecentOrdersAsync(criteria) as ObjectResult;

            var statusCode = (HttpStatusCode)result.StatusCode;

            statusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoMoqData]
        public async Task GetOrderLinesAsync(ResponseBase<GetLines.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetLines.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderLinesAsync("645665656565");

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetOrderLinesAsync_BadRequest(ResponseBase<GetLines.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetLines.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetOrderLinesAsync("645665656565") as ObjectResult;

            var statusCode = (HttpStatusCode)result.StatusCode;

            statusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetPricingConditions(ResponseBase<GetPricingConditions.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetPricingConditions.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetPricingConditions(true, "");

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetPricingConditions_BadRequest(ResponseBase<GetPricingConditions.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetPricingConditions.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetPricingConditions(false, "XYZ") as ObjectResult;

            var statusCode = (HttpStatusCode)result.StatusCode;

            statusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task DownloadInvoicePdfTest(ResponseBase<DownloadInvoicePdf.Response> expected)
        {
            // Arrange
            expected.Content.Filename = "DigitalCommercePlatform.UIServices.Commerce.data.invoice-sample.pdf";
            _mediator.Setup(x => x.Send(It.IsAny<DownloadInvoicePdf.Request>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);
            var controller = GetController();
            // Act
            var result = await controller.DownloadInvoicePdf("123456", null, false).ConfigureAwait(false);
            // Assert
            _mediator.Verify(x => x.Send(It.IsAny<DownloadInvoicePdf.Request>(), It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}