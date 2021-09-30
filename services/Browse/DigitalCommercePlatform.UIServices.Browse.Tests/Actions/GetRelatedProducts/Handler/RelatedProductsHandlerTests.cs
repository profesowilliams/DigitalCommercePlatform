//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetRelatedProducts.Handler
{
    public class RelatedProductsHandlerTests
    {
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public RelatedProductsHandlerTests()
        {
            _mockBrowseService = new Mock<IBrowseService>();
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetRelatedProductsTest(RelatedProductResponseModel expected)
        {
            // Arrange
            _mockBrowseService.Setup(x => x.GetRelatedProducts(
                       It.IsAny<RelatedProductRequestModel>()
                       ))
                   .ReturnsAsync(expected);
            var handler = new GetRelatedProductsHandler.Handler(_mockBrowseService.Object, _mockSiteSettings.Object);
            var productIds = new[] { "11395304" };
            var request = new GetRelatedProductsHandler.Request { ProductId = productIds };
            // Act
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            // Assert
            result.Should().NotBeNull();
        }
    }
}
