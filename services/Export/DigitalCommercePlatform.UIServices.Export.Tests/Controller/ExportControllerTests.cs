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

        private readonly ExportController _controller;

        public ExportControllerTests(ExportControllerFixture fixture)
        {
            _appSettingsMock = fixture.AppSettingsMock;
            _mockMediator = fixture.MockMediator;
            _mockLoggerFactory = fixture.MockLoggerFactory;
            _mockContext = fixture.MockContext;
            _mockSiteSettings = fixture.MockSiteSettings;

            _controller = new ExportController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
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
            var result = await _controller.DownloadQuoteDetails(criteria,"Session").ConfigureAwait(false);

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
            var result = await _controller.DownloadQuoteDetails(criteria,"session").ConfigureAwait(false);

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
            var result = await _controller.DownloadOrderDetails(criteria).ConfigureAwait(false);

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
            var result = await _controller.DownloadOrderDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<NotFoundResult>();
        }

        [Theory]
        [AutoDomainData]
        public async Task DownloadRenewalQuoteDetailsShouldReturnFileContentResult(ResponseBase<DownloadRenewalQuoteDetails.Response> expected)
        {
            expected.Content.MimeType = DownloadRenewalQuoteDetails.mimeType;

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadRenewalQuoteDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            DownloadRenewalQuoteDetails.Request criteria = new();
            var result = await _controller.DownloadRenewalQuoteDetails(criteria).ConfigureAwait(false);

            result.Should().BeOfType<FileContentResult>();
        }

        internal class DownloadRenewalQuoteDetailsNotFoundResultData : TheoryData<ResponseBase<DownloadRenewalQuoteDetails.Response>>
        {
            public DownloadRenewalQuoteDetailsNotFoundResultData()
            {
                Add(null);
                Add(new ResponseBase<DownloadRenewalQuoteDetails.Response>());
                Add(new ResponseBase<DownloadRenewalQuoteDetails.Response>()
                {
                    Content = new()
                    {
                        BinaryContent = null
                    }
                });
            }
        }

        [Theory]
        [ClassData(typeof(DownloadRenewalQuoteDetailsNotFoundResultData))]
        public async Task DownloadRenewalQuoteDetailsShouldReturnNotFoundResult(ResponseBase<DownloadRenewalQuoteDetails.Response> response)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<DownloadRenewalQuoteDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(response);

            DownloadRenewalQuoteDetails.Request criteria = new();
            var result = await _controller.DownloadRenewalQuoteDetails(criteria).ConfigureAwait(false);
            result.Should().BeOfType<NotFoundResult>();
        }
    }
}
