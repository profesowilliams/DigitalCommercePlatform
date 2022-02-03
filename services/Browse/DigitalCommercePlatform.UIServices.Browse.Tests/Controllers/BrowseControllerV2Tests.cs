//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class BrowseControllerV2Tests
    {
        private readonly Mock<IMediator> mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<BrowseControllerV2>> mockLoggerFactory;
        private readonly Mock<IUIContext> mockContext;
        private readonly Mock<ISiteSettings> mockSiteSettings;

        public BrowseControllerV2Tests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            mockMediator = new Mock<IMediator>();
            mockLoggerFactory = new Mock<ILogger<BrowseControllerV2>>();
            mockContext = new Mock<IUIContext>();
            mockSiteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductCatalogV2Service(ResponseBase<GetProductCatalogHandler.Response> expected, ProductCatalogRequest model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductCatalogHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetProductCatalogV2(model).ConfigureAwait(false);
            result.Should().NotBeNull();
        }

        private BrowseControllerV2 GetController() =>
             new BrowseControllerV2(mockMediator.Object, mockLoggerFactory.Object, mockContext.Object,
                    _appSettingsMock.Object, mockSiteSettings.Object);
    }
}
