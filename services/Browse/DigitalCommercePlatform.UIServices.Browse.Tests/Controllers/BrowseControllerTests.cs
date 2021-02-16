
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
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
    }
}
