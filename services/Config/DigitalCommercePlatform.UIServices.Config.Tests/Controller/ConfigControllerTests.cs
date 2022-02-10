//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;
using DigitalCommercePlatform.UIServices.Config.Actions.FindDealsFor;
using DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail;
using DigitalCommercePlatform.UIServices.Config.Actions.GetPunchOutUrl;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;
using DigitalCommercePlatform.UIServices.Config.Actions.ProductPrice;
using DigitalCommercePlatform.UIServices.Config.Actions.Refresh;
using DigitalCommercePlatform.UIServices.Config.Actions.Spa;
using DigitalCommercePlatform.UIServices.Config.Controllers;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
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
                SortDirection = SortDirection.asc,
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
            var criteria = new GetDeals.Request
            {
                Details = true,
                PageNumber = 1,
                PageSize = 25
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
            var criteria = new GetDeals.Request
            {
                Details = true,
                PageNumber = 1,
                PageSize = 25
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
        public async Task GetDealsForGrid(ResponseBase<GetDealsFor.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetDealsFor.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetDealFor(new GetDealsFor.Request()).ConfigureAwait(false);

            result.Should().Equals(HttpStatusCode.OK);
        }

        [Fact]
        public async Task Get_Refresh_WithStatusOk()
        {
            ResponseBase<RefreshData.Response> expected = new ResponseBase<RefreshData.Response>();
            _mockMediator.Setup(x => x.Send(
                      It.IsAny<RefreshData.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var sut = GetController();
            RefreshData.Request request = new RefreshData.Request() { Type = "Estimate", VendorName = "Cisco", Version = "1" };
            var result = await sut.Refresh(request).ConfigureAwait(false);
            result.Should().Equals(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetSPADetails()
        {
            ResponseBase<SpaDetails.Response> expected = new ResponseBase<SpaDetails.Response>();
            _mockMediator.Setup(x => x.Send(
                      It.IsAny<SpaDetails.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var sut = GetController();
            var result = await sut.GetSpa("2294844", "PNV602,PNR703,PNL401C", true).ConfigureAwait(false);
            result.Should().Equals(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetProductPrice()
        {
            //arrange
            ResponseBase<GetProductPrice.Response> expected = new ResponseBase<GetProductPrice.Response>();
            _mockMediator.Setup(x => x.Send(
                      It.IsAny<GetProductPrice.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            //act
            PriceCriteriaModel request = new PriceCriteriaModel();
            var sut = GetController();
            var result = await sut.GetProductPrice(request).ConfigureAwait(false);

            //assert
            result.Should().Equals(HttpStatusCode.OK);
        }

        private ConfigController GetController()
        {
            var httpRequestMock = new Mock<HttpRequest>();

            httpRequestMock.Setup(x => x.Scheme).Returns("http");
            httpRequestMock.Setup(x => x.Host).Returns(HostString.FromUriComponent(new Uri("http://localhost:8080")));


            return new ConfigController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object, _appSettingsMock.Object, _mockSiteSettings.Object)
            {
                ControllerContext = new ControllerContext()
                {
                    HttpContext = Mock.Of<HttpContext>(_ => _.Request == httpRequestMock.Object)
                }
            };
        }
    }
}
