//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Providers.Settings;
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
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<ICultureService> _mockcultureService;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public RelatedProductsHandlerTests()
        {
            _mockBrowseService = new Mock<IBrowseService>();
            _mockSiteSettings = new Mock<ISiteSettings>();
            _mapper = new Mock<IMapper>();
            _mockcultureService = new Mock<ICultureService>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetRelatedProductsTest(RelatedProductResponseDto expected)
        {
            // Arrange
            _mockBrowseService.Setup(x => x.GetRelatedProducts(
                       It.IsAny<RelatedProductRequestDto>()
                       ))
                   .ReturnsAsync(expected);
            var handler = new GetRelatedProductsHandler.Handler(
                _mockBrowseService.Object,
                _mockSiteSettings.Object,
                _mapper.Object,
                _mockcultureService.Object);

            var productIds = new[] { "11395304" };
            var request = new GetRelatedProductsHandler.Request { ProductId = productIds };
            // Act
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            // Assert
            result.Should().NotBeNull();
        }
    }
}