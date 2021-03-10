using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Controller
{
    public class DashBoardControllerTests
    {
        private readonly Mock<IContext> _context;
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
            _context = new Mock<IContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<SecurityController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _optionsMock.Setup(s => s.Value).Returns(appSettings);
            _siteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetConfigurationsSummary(GetConfigurationsSummary.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurationsSummary.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetConfigurationsSummary("dashboard").ConfigureAwait(false);

            result.Should().NotBeNull();
        }


        [Theory]
        [AutoDomainData]
        public async Task GetDealsSummary(GetDealsSummary.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetDealsSummary.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetDealsSummary("2,7,14").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeals_BadRequest(GetDealsSummary.Response expected)
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
        public async Task GetConfigurationsSummary_BadRequest(GetConfigurationsSummary.Response expected)
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
        public async Task GetCartDetails(GetConfigurationsSummary.Response expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetConfigurationsSummary.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCartDetails("1234").ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetActionItems(GetActionItems.Response expected)
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
        public async Task GetActionItems_BadRequest(GetActionItems.Response expected)
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
        public async Task GetTopConfigurations(GetTopConfigurations.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetTopConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopConfigurations("5").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetTopConfigurations_BadRequest(GetTopConfigurations.Response expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetTopConfigurations.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopConfigurations(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }
        [Theory]
        [AutoDomainData]
        public async Task GetTopQuotes(GetTopQuotes.Response expected)
        {

            _mediator.Setup(x => x.Send(
                       It.IsAny<GetTopQuotes.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopQuotes("5").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetTopQuotes_BadRequest(GetTopQuotes.Response expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<GetTopQuotes.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetTopQuotes(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        private DashBoardController GetController()
        {
            return new DashBoardController(_mediator.Object, _optionsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }
    }
}
