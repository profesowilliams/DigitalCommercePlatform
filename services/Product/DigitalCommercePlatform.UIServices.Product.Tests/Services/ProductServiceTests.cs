//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Product.Actions;
using DigitalCommercePlatform.UIServices.Product.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Product.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Product.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClientMock;
        private readonly Mock<DigitalFoundation.Common.Settings.IAppSettings> _appSettingsMock;
        private readonly FakeLogger<ProductService> _loggerMock;

        public ProductServiceTests()
        {
            _middleTierHttpClientMock = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<DigitalFoundation.Common.Settings.IAppSettings>();
            _loggerMock = new FakeLogger<ProductService>();
            _appSettingsMock.Setup(s => s.GetSetting("App.Product.Url")).Returns("http://fakeUrlForAppProduct");
        }

        [Fact]
        public void ShouldReturnProductService()
        {
            //Arrange and Act
            var productService = GetProductService();
            //Assert
            productService.Should().BeOfType<ProductService>();
            _appSettingsMock.Verify(x => x.GetSetting("App.Product.Url"), Times.Once);

        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetailsLogsInformation(ProductDetails.Request request, IEnumerable<ProductModel> response)
        {
            //Arrange
            var productService = GetProductService();
            _middleTierHttpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductModel>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ReturnsAsync(response).Verifiable();
            //Act
            var result = await productService.GetProductDetails(request).ConfigureAwait(false);
            //Assert
            result.Should().BeEquivalentTo(response);
            _middleTierHttpClientMock.Verify();
            _loggerMock.GetMessages().Should().Contain("Calling app-product from GetProductDetails");
        }

        private ProductService GetProductService()
        {
            return new ProductService(_middleTierHttpClientMock.Object, _appSettingsMock.Object, _loggerMock);
        }

    }
}
