//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class GetCatalogHandlerTests
    {
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<ICachingService> _mockCacheService;

        public GetCatalogHandlerTests()
        {
            _mockBrowseService = new();
            _mockCacheService = new();
        }

        public string CatalogId { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogDetails(List<CatalogResponse> expected)
        {
            _mockBrowseService.Setup(x => x.GetCatalogDetails(
                       It.IsAny<GetCatalogHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetCatalogHandler.Handler(_mockBrowseService.Object, _mockCacheService.Object);

            var request = new GetCatalogHandler.Request(CatalogId);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}

