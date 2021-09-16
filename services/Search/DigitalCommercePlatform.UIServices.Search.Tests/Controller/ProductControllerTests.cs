//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Controllers;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Search.Actions.Product.FullSearch;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Controller
{
    public class ProductControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<ProductController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public ProductControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _mockMediator = new Mock<IMediator>();

            _mockLoggerFactory = new Mock<ILogger<ProductController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        private ProductController GetController()
        {
            return new ProductController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task FullSearchResponseNotNull(Response expected, FullSearchRequestModel request)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.FullSearch(request).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
