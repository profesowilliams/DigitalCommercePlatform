//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.Product;
using DigitalCommercePlatform.UIServices.Search.Controllers;
using DigitalCommercePlatform.UIServices.Search.Infrastructure.ActionResults;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
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

        [Theory]
        [AutoDomainData]
        public async Task KeywordSearchResponseNotNull(KeywordSearch.Response expected, string keyword, string categoryId)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<KeywordSearch.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.KeywordSearch(keyword, categoryId).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task ExportResponse_OkObjectResult_WhenJsonRequested(IEnumerable<ExportResponseModel> expected, ExportRequestModel request)
        {
            request.ExportFormat = ExportFormatEnum.json;

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<ExportSearch.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected)
                   .Verifiable();

            var controller = GetController();

            var result = await controller.Export(request).ConfigureAwait(false);

            result.Should().NotBeNull();
            result.Should().BeOfType<OkObjectResult>();
        }

        [Theory]
        [AutoDomainData]
        public async Task ExportResponse_CsvResult_WhenJsonRequested(IEnumerable<ExportResponseModel> expected, ExportRequestModel request)
        {
            request.ExportFormat = ExportFormatEnum.csv;

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<ExportSearch.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected)
                   .Verifiable();

            var controller = GetController();

            var result = await controller.Export(request).ConfigureAwait(false);

            result.Should().NotBeNull();
            result.Should().BeOfType<CsvActionResult<ExportResponseModel>>();
        }

        [Theory]
        [AutoDomainData]
        public async Task ExportResponse_NotFoundResult_WhenNothingFound(ExportRequestModel request)
        {
            request.ExportFormat = ExportFormatEnum.csv;

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<ExportSearch.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(Array.Empty<ExportResponseModel>())
                   .Verifiable();

            var controller = GetController();

            var result = await controller.Export(request).ConfigureAwait(false);

            result.Should().NotBeNull();
            result.Should().BeOfType<NotFoundResult>();
        }
    }
}