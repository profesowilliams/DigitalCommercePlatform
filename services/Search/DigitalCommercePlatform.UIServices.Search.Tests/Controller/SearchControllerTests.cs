//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Controllers;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Controller
{
    public class SearchControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<TypeAheadController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public SearchControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _mockMediator = new Mock<IMediator>();

            _mockLoggerFactory = new Mock<ILogger<TypeAheadController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        private TypeAheadController GetController()
        {
            return new TypeAheadController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadSearch(TypeAhead.Response expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<TypeAhead.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.TypeAhead("12").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadProductSearchPreview(ProductSearchPreview.Response expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<ProductSearchPreview.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.TypeAheadProductSearchPreview("Test", "1").ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
