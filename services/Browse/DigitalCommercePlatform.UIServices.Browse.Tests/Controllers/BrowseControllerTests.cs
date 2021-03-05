
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
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
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ILogger<BrowseController>> _mockLoggerFactory;
        private readonly Mock<IContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public BrowseControllerTests()
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

            _mockLoggerFactory = new Mock<ILogger<BrowseController>>();
            _mockContext = new Mock<IContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }
        private BrowseController GetController()
        {
            return new BrowseController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _mockOptions.Object, _mockSiteSettings.Object);
        }

        [Theory]
        [AutoMoqData]
        public async Task GetCartDetails(GetCartHandler.GetCartResponse expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCartHandler.GetCartRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCartDetails("12", "12").ConfigureAwait(false);

            result.Should().NotBeNull();
        }
        [Theory]
        [AutoMoqData]
        public async Task GetCustomerDetails(GetCustomerHandler.GetCustomerResponse expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCustomerHandler.GetCustomerRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCustomer("0038048612").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetCatalogueDetails(GetCatalogueHandler.GetCatalogueResponse expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCatalogueHandler.GetCatalogueRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
          
            var controller = GetController();

            var result = await controller.GetCatalogue("FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task GetHeaderDetails(GetHeaderHandler.GetHeaderResponse expected)
        {


            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetHeaderHandler.GetHeaderRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetHeader("1", "0038048612", "FCS").ConfigureAwait(false);

            result.Should().NotBeNull();
        }
        [Theory]
        [AutoMoqData]
        public async Task FindProductdetials(FindProductHandler.GetProductResponse expected)
        {
            var detailsInput = new FindProductModel()
            {
                MaterialNumber = new string[] { "123" },
                OldMaterialNumber = new string[] { "123" },
                Manufacturer = new string[] { "123" },
                MfrPartNumber = new string[] { "123" },
                UPC = new string[] { "123" },
                CustomerNumber = "123",
                CustomerPartNumber = "123",
                SalesOrganization = "123",
                MaterialStatus = new string[] { "123" },
                Territories = new string[] { "123" },
                Description = "123"
            };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<FindProductHandler.GetProductRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.FindProduct(detailsInput, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task FindSummarydetials(FindSummaryHandler.FindSummaryResponse expected)
        {
            var summaryInput = new FindProductModel()
            {
                MaterialNumber = new string[] { "123" },
                OldMaterialNumber = new string[] { "123" },
                Manufacturer = new string[] { "123" },
                MfrPartNumber = new string[] { "123" },
                UPC = new string[] { "123" },
                CustomerNumber = "123",
                CustomerPartNumber = "123",
                SalesOrganization = "123",
                MaterialStatus = new string[] { "123" },
                Territories = new string[] { "123" },
                Description = "123"
            };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<FindSummaryHandler.FindSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.FindProduct(summaryInput, false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }


        [Theory]
        [AutoMoqData]
        public async Task GetProductdetials(GetProductDetailsHandler.GetProductDetailsResponse expected)
        {
            var data = new List<string> { "123" };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductDetailsHandler.GetProductDetailsRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetProduct(data, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }


        [Theory]
        [AutoMoqData]
        public async Task GetProductSummary(GetProductSummaryHandler.GetProductSummaryResponse expected)
        {
            var data = new List<string> { "123" };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductSummaryHandler.GetProductSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetProduct(data, false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
