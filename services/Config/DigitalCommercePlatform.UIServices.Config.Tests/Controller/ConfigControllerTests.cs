using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindSPA;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetPunchOutUrl;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Controllers;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Controller
{
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
            var criteria = new FindModel
            {
                SortBy = "createdOn",
                SortDirection = Models.Common.SortDirection.asc,
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
                SortDirection = Models.Common.SortDirection.asc,
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
                SortDirection = Models.Common.SortDirection.asc,
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

        [Theory]
        [AutoDomainData]
        public async Task EstimationValidate(ResponseBase<EstimationValidate.Response> expected, FindModel model)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<EstimationValidate.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.EstimationValidate(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetPunchOutUrl_OKResponse(ResponseBase<GetPunchOutUrl.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetPunchOutUrl.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetPunchOutUrl(new GetPunchOutUrl.Request()).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetSPA(ResponseBase<GetSPA.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetSPA.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetSPA(new GetSPA.Request()).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        private ConfigController GetController()
        {
            return new ConfigController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }
    }
}