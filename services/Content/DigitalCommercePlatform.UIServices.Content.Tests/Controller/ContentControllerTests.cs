using DigitalCommercePlatform.UIServices.Content.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Content.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Controllers;
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


namespace DigitalCommercePlatform.UIServices.Content.Tests.Controller
{
    public class ContentControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ILogger<ContentController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public ContentControllerTests()
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

            _mockLoggerFactory = new Mock<ILogger<ContentController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }
        private ContentController GetController()
        {
            return new ContentController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _mockOptions.Object, _mockSiteSettings.Object);
        }
        [Theory]
        [AutoDomainData]
        public async Task GetCartDetails(ResponseBase<GetCart.Response> expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCart.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCartDetails("12").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetActiveCartDetails(ResponseBase<GetActiveCart.Response> expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetActiveCart.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetActiveCartDetails().ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadSearch(ResponseBase<TypeAheadSearch.Response> expected)
        {

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<TypeAheadSearch.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            

            var controller = GetController();

            var result = await controller.TypeAheadSearch("12", 123).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
