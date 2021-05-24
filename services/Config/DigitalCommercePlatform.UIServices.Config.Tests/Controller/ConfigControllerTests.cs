using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetEstimations;
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
using Moq;
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
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<BaseUIServiceController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public ConfigControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _mockMediator = new Mock<IMediator>();
            _mockLoggerFactory = new Mock<ILogger<BaseUIServiceController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetRecentConfigurations(ResponseBase<GetConfigurations.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetConfigurations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Configurations.FindModel
            {
                SortBy = "createdOn",
                SortDirection = "asc",
                Id = string.Empty,
            };

            var result = await controller.GetRecentConfigurations(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeals(ResponseBase<GetDeals.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                SortBy = "createdOn",
                SortDirection = "asc",
            };

            var result = await controller.GetDeals(criteria).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeals_OKResponse(ResponseBase<GetDeals.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var criteria = new Models.Deals.FindModel
            {
                SortBy = "createdOn",
                SortDirection = "asc",
            };

            var result = await controller.GetDeals(criteria).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeal(ResponseBase<GetDeal.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeal.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetDeal("123", "123").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetDeal_OKResponse(ResponseBase<GetDeal.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeal.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetDeal("123", "123").ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        //[Theory]
        //[AutoDomainData]
        //public async Task GetConfigurations_BadRequest(GetConfigurations.Response expected)
        //{
        //    _mockMediator.Setup(x => x.Send(
        //               It.IsAny<GetConfigurations.Request>(),
        //               It.IsAny<CancellationToken>()))
        //           .ReturnsAsync(expected);

        //    var controller = GetController();

        //    var result = await controller.GetConfigurations(null).ConfigureAwait(false);

        //    result.Should().Equals(HttpStatusCode.BadRequest);
        //}
        [Theory]
        [AutoDomainData]
        public async Task GetDeals_BadRequest(ResponseBase<GetDeals.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDeals.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetDeals(null).ConfigureAwait(false);
            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        //[Theory]
        //[AutoDomainData]
        //public async Task GetDeal_BadRequest(GetDeal.Response expected)
        //{
        //    _mockMediator.Setup(x => x.Send(
        //               It.IsAny<GetDeal.Request>(),
        //               It.IsAny<CancellationToken>()))
        //           .ReturnsAsync(expected);

        //    var controller = GetController();

        //    var result = await controller.GetDeal(null).ConfigureAwait(false);
        //    result.Should().Equals(HttpStatusCode.BadRequest);
        //}

        [Theory]
        [AutoDomainData]
        public async Task GetEstimations(ResponseBase<GetEstimations.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetEstimations.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetEstimations().ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        private ConfigController GetController()
        {
            return new ConfigController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }
    }
}