//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Search.Actions.Redirect.KeywordSearch;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Controller
{
    public class RedirectControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<RedirectController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public RedirectControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _mockMediator = new Mock<IMediator>();

            _mockLoggerFactory = new Mock<ILogger<RedirectController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        private RedirectController GetController() => new RedirectController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);

        [Theory]
        [AutoDomainData]
        public async Task FullSearchResponseNotNull(Response expected, string keyword)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.KeywordSearch(keyword).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Fact]
        public async Task FullSearchResponse_Null()
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(new Response());

            var controller = GetController();

            var result = await controller.KeywordSearch("tesr").ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}