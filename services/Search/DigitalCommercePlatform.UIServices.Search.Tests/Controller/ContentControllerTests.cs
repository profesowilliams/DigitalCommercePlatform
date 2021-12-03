//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Controllers;
using DigitalCommercePlatform.UIServices.Search.Models.Content;
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
using static DigitalCommercePlatform.UIServices.Search.Actions.Content.FullSearch;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Controller
{
    public class ContentControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<ContentController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public ContentControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _mockMediator = new Mock<IMediator>();

            _mockLoggerFactory = new Mock<ILogger<ContentController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        private ContentController GetController()
        {
            return new ContentController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
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

        [Theory]
        [AutoDomainData]
        public async Task KeywordSearchResponseNotNull(Response expected, FullSearchRequestModel request)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.KeywordSearch(request.Keyword).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
