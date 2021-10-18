//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using DigitalCommercePlatform.UIServices.Export.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Http.Controller;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Controller
{
    public class ExportControllerTests : IClassFixture<ExportControllerFixture>
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<BaseUIServiceController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public ExportControllerTests(ExportControllerFixture fixture)
        {
            _appSettingsMock = fixture.AppSettingsMock;

            _mockMediator = fixture.MockMediator;
            _mockLoggerFactory = fixture.MockLoggerFactory;
            _mockContext = fixture.MockContext;
            _mockSiteSettings = fixture.MockSiteSettings;
        }

        [Theory]
        [AutoDomainData]
        public async Task DownloadQuoteDetailsShouldReturnFileContentResult(ResponseBase<DownloadQuoteDetails.Response> expected)
        {
            expected.Content.MimeType = DownloadQuoteDetails.mimeType;

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadQuoteDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            DownloadQuoteDetails.Request criteria = new();
            var controller = GetController();
            var result = await controller.DownloadQuoteDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<FileContentResult>();
        }

        [Fact]
        public async Task DownloadQuoteDetailsShouldReturnNotFoundResult()
        {
            ResponseBase<DownloadQuoteDetails.Response> expected = new();

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadQuoteDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            DownloadQuoteDetails.Request criteria = new();
            var controller = GetController();
            var result = await controller.DownloadQuoteDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<NotFoundResult>();
        }

        protected ExportController GetController()
        {
            return new ExportController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }
    }
}
