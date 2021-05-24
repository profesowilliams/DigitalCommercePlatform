using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class BrowseControllerTests
    {
        private readonly Mock<IMediator> mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<BrowseController>> mockLoggerFactory;
        private readonly Mock<IUIContext> mockContext;
        private readonly Mock<ISiteSettings> mockSiteSettings;

        public BrowseControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            mockMediator = new Mock<IMediator>();

            mockLoggerFactory = new Mock<ILogger<BrowseController>>();
            mockContext = new Mock<IUIContext>();
            mockContext.SetupGet(x => x.Language).Returns("en-us");
            mockSiteSettings = new Mock<ISiteSettings>();
        }

        private BrowseController GetController()
        {
            return new BrowseController(mockMediator.Object, mockLoggerFactory.Object, mockContext.Object,
                _appSettingsMock.Object, mockSiteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCartDetails(ResponseBase<GetCartHandler.Response> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCartHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCartDetails(true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCustomerDetails(ResponseBase<GetCustomerHandler.Response> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCustomerHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCustomer().ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogDetails(ResponseBase<GetCatalogHandler.Response> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCatalogHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetCatalog("FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetHeaderDetails(ResponseBase<GetHeaderHandler.Response> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetHeaderHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetHeader("FCS", true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductDetails(ResponseBase<FindProductHandler.Response> expected,
            FindProductModel model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<FindProductHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.FindProduct(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindSummaryDetails(ResponseBase<FindSummaryHandler.Response> expected,
            FindProductModel model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<FindSummaryHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.FindProduct(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(ResponseBase<GetProductDetailsHandler.Response> expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductDetailsHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetProduct(data, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductSummary(ResponseBase<GetProductSummaryHandler.Response> expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductSummaryHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetProduct(data, false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}