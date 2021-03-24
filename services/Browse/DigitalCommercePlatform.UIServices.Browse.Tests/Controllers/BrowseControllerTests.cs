using AutoFixture.Xunit2;
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
using Microsoft.Extensions.Options;
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
        private readonly Mock<IOptions<AppSettings>> mockOptions;
        private readonly Mock<ILogger<BrowseController>> mockLoggerFactory;
        private readonly Mock<IUIContext> mockContext;
        private readonly Mock<ISiteSettings> mockSiteSettings;

        public BrowseControllerTests()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            mockMediator = new Mock<IMediator>();
            mockOptions = new Mock<IOptions<AppSettings>>();
            mockOptions.Setup(s => s.Value).Returns(appSettings);

            mockLoggerFactory = new Mock<ILogger<BrowseController>>();
            mockContext = new Mock<IUIContext>();
            mockContext.SetupGet(x => x.Language).Returns("en-us");
            mockSiteSettings = new Mock<ISiteSettings>();
        }
        private BrowseController GetController()
        {
            return new BrowseController(mockMediator.Object, mockLoggerFactory.Object, mockContext.Object,
                mockOptions.Object, mockSiteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCartDetails(ResponseBase<GetCartHandler.GetCartResponse> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCartHandler.GetCartRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

           var controller = GetController();

            var result = await controller.GetCartDetails("12", "12").ConfigureAwait(false);

            result.Should().NotBeNull();
        }



        [Theory]
        [AutoDomainData]
        public async Task GetCustomerDetails(ResponseBase<GetCustomerHandler.GetCustomerResponse> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCustomerHandler.GetCustomerRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCustomer("0038048612").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogDetails(ResponseBase<GetCatalogHandler.GetCatalogResponse> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCatalogHandler.GetCatalogRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetCatalog("FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetHeaderDetails(ResponseBase<GetHeaderHandler.GetHeaderResponse> expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetHeaderHandler.GetHeaderRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetHeader("1", "0038048612", "FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductDetails(ResponseBase<FindProductHandler.GetProductResponse> expected,
            FindProductModel model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<FindProductHandler.GetProductRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.FindProduct(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindSummaryDetails(ResponseBase<FindSummaryHandler.FindSummaryResponse> expected,
            FindProductModel model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<FindSummaryHandler.FindSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.FindProduct(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(ResponseBase<GetProductDetailsHandler.GetProductDetailsResponse> expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductDetailsHandler.GetProductDetailsRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetProduct(data, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductSummary(ResponseBase<GetProductSummaryHandler.GetProductSummaryResponse> expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductSummaryHandler.GetProductSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetProduct(data, false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
