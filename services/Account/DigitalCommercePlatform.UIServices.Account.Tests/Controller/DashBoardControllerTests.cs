using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Actions.RenewalsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.TopDeals;
using static DigitalCommercePlatform.UIServices.Account.Actions.GetConfigurationsFor.GetConfigurationsFor;
using DigitalCommercePlatform.UIServices.Account.Actions.ShipToAddress;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Controller
{
    public class DashBoardControllerTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<SecurityController>> _logger;
        private readonly Mock<IOptions<AppSettings>> _optionsMock;
        private readonly Mock<ISiteSettings> _siteSettings;
        public DashBoardControllerTests()
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
            _logger = new Mock<ILogger<SecurityController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _optionsMock.Setup(s => s.Value).Returns(appSettings);
            _siteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetConfigurationsSummary(ResponseBase<GetConfigurationsSummary.Response> expected)
        {
            // Arrange
            expected.Error = null;
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurationsSummary.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            // Act
            var result = await controller.GetConfigurationsSummary("dashboard").ConfigureAwait(false);
            // Assert
            _mediator.Verify(x => x.Send(It.IsAny<GetConfigurationsSummary.Request>(), It.IsAny<CancellationToken>()), Times.Once);
            var response = result as ObjectResult;
            Assert.Equal((int)HttpStatusCode.OK, response.StatusCode);
            Assert.NotNull(expected.Content);
            Assert.Null(expected.Error);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDealsSummary(ResponseBase<GetDealsSummary.Response> expected)
        {
            // Arrange
            expected.Error = null;
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetDealsSummary.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            // Act
            var result = await controller.GetDealsSummary("2,7,14").ConfigureAwait(false);
            // Assert
            _mediator.Verify(x => x.Send(It.IsAny<GetDealsSummary.Request>(), It.IsAny<CancellationToken>()), Times.Once);
            var response = result as ObjectResult;
            Assert.Equal((int)HttpStatusCode.OK, response.StatusCode);
            Assert.NotNull(expected.Content);
            Assert.Null(expected.Error);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeals_BadRequest(ResponseBase<GetDealsSummary.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetDealsSummary.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetDealsSummary(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetConfigurationsSummary_BadRequest(ResponseBase<GetConfigurationsSummary.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetConfigurationsSummary.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetConfigurationsSummary(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetSavedCarts(ResponseBase<GetCartsList.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetCartsList.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetSavedCartList(false,50).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetQuotesData(ResponseBase<Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetConfigurationsFor(false, 50, RequestType.DealId).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetActionItems(ResponseBase<GetActionItems.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetActionItems.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetActionItems("1").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetActionItems_BadRequest(ResponseBase<GetActionItems.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetActionItems.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetActionItems(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetTopConfigurations(ResponseBase<GetTopConfigurations.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetTopConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopConfigurations(5).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetTopDeals(ResponseBase<GetTopDeals.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetTopDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopDeals(5).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetTopConfigurations_BadRequest(ResponseBase<GetTopConfigurations.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetTopConfigurations.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopConfigurations(0).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }
        [Theory]
        [AutoDomainData]
        public async Task GetTopQuotes(ResponseBase<GetTopQuotes.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetTopQuotes.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopQuotes(5).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetTopQuotes_BadRequest(ResponseBase<GetTopQuotes.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetTopQuotes.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopQuotes(0).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }


        [Theory]
        [AutoDomainData]
        public async Task GetRenewals(ResponseBase<GetRenewalsSummary.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetRenewalsSummary.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetRenewals("5").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetRenewals_BadRequest(ResponseBase<GetRenewalsSummary.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetRenewalsSummary.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetRenewals(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetMyQuote(ResponseBase<MyQuoteDashboard.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<MyQuoteDashboard.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetMyQuote("123").ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetMyOrder(ResponseBase<GetMyOrders.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetMyOrders.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetMyOrder(true).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }
        [Theory]
        [AutoDomainData]
        public async Task GetShipToAddress(ResponseBase<GetShipToAddress.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetShipToAddress.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetShipToAddress().ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }



        private DashBoardController GetController()
        {
            return new DashBoardController(_mediator.Object, _optionsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }
    }
}
