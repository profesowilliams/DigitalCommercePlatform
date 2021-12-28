//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Actions.Order;
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using DigitalCommercePlatform.UIServices.Export.Controllers;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
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

        internal class DownloadQuoteDetailsNotFoundResultData : TheoryData<ResponseBase<DownloadQuoteDetails.Response>>
        {
            public DownloadQuoteDetailsNotFoundResultData()
            {
                Add(null);
                Add(new ResponseBase<DownloadQuoteDetails.Response>());
                Add(new ResponseBase<DownloadQuoteDetails.Response>() { 
                    Content = new()
                    {
                        BinaryContent = null
                    }
                });
            }
        }

        [Theory]
        [ClassData(typeof(DownloadQuoteDetailsNotFoundResultData))]
        public async Task DownloadQuoteDetailsShouldReturnNotFoundResult(ResponseBase<DownloadQuoteDetails.Response> response)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadQuoteDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(response);

            DownloadQuoteDetails.Request criteria = new();
            var controller = GetController();
            var result = await controller.DownloadQuoteDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<NotFoundResult>();
        }

        [Theory]
        [AutoDomainData]
        public async Task DownloadOrderDetailsShouldReturnFileContentResult(ResponseBase<DownloadOrderDetails.Response> expected)
        {
            expected.Content.MimeType = DownloadOrderDetails.mimeType;

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadOrderDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            DownloadOrderDetails.Request criteria = new();
            var controller = GetController();
            var result = await controller.DownloadOrderDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<FileContentResult>();
        }

        internal class DownloadOrderDetailsNotFoundResultData : TheoryData<ResponseBase<DownloadOrderDetails.Response>>
        {
            public DownloadOrderDetailsNotFoundResultData()
            {
                Add(null);
                Add(new ResponseBase<DownloadOrderDetails.Response>());
                Add(new ResponseBase<DownloadOrderDetails.Response>()
                {
                    Content = new()
                    {
                        BinaryContent = null
                    }
                });
            }
        }

        [Theory]
        [ClassData(typeof(DownloadOrderDetailsNotFoundResultData))]
        public async Task DownloadOrderDetailsShouldReturnNotFoundResult(ResponseBase<DownloadOrderDetails.Response> response)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadOrderDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(response);

            DownloadOrderDetails.Request criteria = new();
            var controller = GetController();
            var result = await controller.DownloadOrderDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<NotFoundResult>();
        }

        protected ExportController GetController()
        {
            return new ExportController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }
    }
}
