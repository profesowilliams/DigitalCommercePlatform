//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Product.Actions;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Product.Tests.Actions
{
    public class ProductDetailsTests
    {
        private readonly Mock<IProductService> _mockProductService;
        private readonly Mock<IMapper> _mapper;

        public ProductDetailsTests()
        {
            _mockProductService = new Mock<IProductService>();
            _mapper = new Mock<IMapper>();
        }

        [Fact]
        public async Task GetProductDetailsTestMissingId()
        {
            // Arrange
            var validator = new ProductDetails.Validator();
            var cmd = new ProductDetails.Request(null);
            // Act
            var validationResult = await validator.ValidateAsync(cmd);
            // Assert
            Assert.False(validationResult.IsValid);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetailsTest(IEnumerable<ProductModel> expected)
        {
            // Arrange
            _mockProductService.Setup(x => x.GetProductDetails(
                       It.IsAny<ProductDetails.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new ProductDetails.Handler(_mockProductService.Object, _mapper.Object);
            var id = "123456";
            var request = new ProductDetails.Request(id);
            // Act
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            // Assert
            result.Should().NotBeNull();
        }
    }
}