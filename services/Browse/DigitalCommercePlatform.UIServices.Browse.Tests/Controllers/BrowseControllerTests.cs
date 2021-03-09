using AutoFixture.Xunit2;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class BrowseControllerTests
    {
        public static AppSettings GetAppSettings()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            return appSettings;
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCartDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            GetCartHandler.GetCartResponse expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCartHandler.GetCartRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetCartDetails("12", "12").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCustomerDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            GetCustomerHandler.GetCustomerResponse expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCustomerHandler.GetCustomerRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetCustomer("0038048612").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            GetCatalogHandler.GetCatalogResponse expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCatalogHandler.GetCatalogRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetCatalog("FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetHeaderDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            GetHeaderHandler.GetHeaderResponse expected)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetHeaderHandler.GetHeaderRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetHeader("1", "0038048612", "FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            FindProductHandler.GetProductResponse expected,
            FindProductModel model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<FindProductHandler.GetProductRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.FindProduct(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindSummaryDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            FindSummaryHandler.FindSummaryResponse expected,
            FindProductModel model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<FindSummaryHandler.FindSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.FindProduct(model).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            GetProductDetailsHandler.GetProductDetailsResponse expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductDetailsHandler.GetProductDetailsRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetProduct(data, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductSummary(
            [Frozen]Mock<IMediator> mockMediator,
            [Greedy]BrowseController controller,
            GetProductSummaryHandler.GetProductSummaryResponse expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductSummaryHandler.GetProductSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var result = await controller.GetProduct(data, false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}