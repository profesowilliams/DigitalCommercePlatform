using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Controller
{
    [ExcludeFromCodeCoverage]
    public class ConfigControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ILogger<BaseUIServiceController>> _mockLoggerFactory;
        private readonly Mock<IContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;
        public ConfigControllerTests()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            _mockMediator = new Mock<IMediator>();
            _mockOptions = new Mock<IOptions<AppSettings>>();
            _mockOptions.Setup(s => s.Value).Returns(appSettings);

            _mockLoggerFactory = new Mock<ILogger<BaseUIServiceController>>();
            _mockContext = new Mock<IContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetConfigurations(GetConfigurations.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Configurations.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "createdOn",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetConfigurations(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetConfigurations_OKResponse(GetConfigurations.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Configurations.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "createdOn",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetConfigurations(criteria).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeals(GetDeals.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "createdOn",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetDeals(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeals_OKResponse(GetDeals.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "createdOn",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetDeals(criteria).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeal(GetDeal.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeal.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "TDPartNumber",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetDeal(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeal_OKResponse(GetDeal.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeal.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                CustomerId = "00380000",
                UserId = "50546",
                SortBy = "TDPartNumber",
                //SortDirection = "createdOn",
            };

            var result = await controller.GetDeal(criteria).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }
    

        [Theory]
        [AutoDomainData]
        public async Task GetConfigurations_BadRequest(GetConfigurations.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetConfigurations(null).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.BadRequest);
        }
        [Theory]
        [AutoDomainData]
        public async Task GetDeals_BadRequest(GetDeals.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetDeals(null).ConfigureAwait(false);
            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeal_BadRequest(GetDeal.Response expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeal.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetDeal(null).ConfigureAwait(false);
            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        private ConfigController GetController()
        {
            return new ConfigController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _mockOptions.Object, _mockSiteSettings.Object);
        }
    }
}
