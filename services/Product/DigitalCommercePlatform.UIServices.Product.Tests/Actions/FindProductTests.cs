using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Automapper;
using DigitalCommercePlatform.UIService.Product.Dto.Product;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalCommercePlatform.UIService.Product.Models.Product.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
{
    public class FindProductTests
    {
        private readonly FakeLogger<FindProduct.Handler> _logger;
        private readonly IMapper _mapper;
        private readonly Mock<IMiddleTierHttpClient> _httpClient;
        private readonly Mock<IOptions<AppSettings>> _options;

        public FindProductTests()
        {
            _logger = new FakeLogger<FindProduct.Handler>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));
            _httpClient = new Mock<IMiddleTierHttpClient>();
            _options = new Mock<IOptions<AppSettings>>();
            var settings = new AppSettings();
            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" }, { "Core.Stock.Url", "http://stock" } });
            _options.Setup(x => x.Value).Returns(settings);
        }

        [Theory]
        [InlineData(true)]
        [InlineData(false)]
        [AutoDomainData]
        public async Task FindProduct_RequestWithPagination_CallCoreForDataAndCount(bool withPaginationInfo)
        {
            // Arrange
            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = withPaginationInfo };

            _httpClient.Setup(x => x.GetAsync<FindProduct.Response>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                       .ReturnsAsync(new FindProduct.Response());

            var sut = GetHandler();

            // Act
            _ = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

            // Assert
            _httpClient.Verify(x => x.GetAsync<FindProduct.Response>(It.Is<string>(

                x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
                            && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
                            && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
                            && x.Contains($"WithPaginationInfo={withPaginationInfo}", StringComparison.InvariantCultureIgnoreCase)),
                                                                        It.IsAny<IEnumerable<object>>(),
                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Fact]
        public async Task FindProduct_ReturnsEmptyStockDataWhenStockCoreThrowsNotFoundException()
        {
            var data = new FindProduct.Response(new List<Models.Product.ProductModel>() {
                new Models.Product.ProductModel {
                    Name = "Test",
                    MaterialType = "1",
                    Plants = new List<PlantModel>()
                }
            });

            // Arrange
            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

            _httpClient.Setup(x => x.GetAsync<FindProduct.Response>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ReturnsAsync(data);

            var sut = GetHandler();

            // Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            // Assert
            result.ReturnObject.Should().HaveCount(data.ReturnObject.Count());
            result.ReturnObject.Any(x => x.Plants.Any(p => p.Stock != null)).Should().BeFalse();
        }

        [Fact]
        public async Task FindProduct_ReturnsNull_WhenNotFoundReturnedFromCore()
        {
            // Arrange
            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ThrowsAsync(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

            var sut = GetHandler();

            // Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            // Assert
            result.Should().BeNull();
        }

        [Theory]
        [AutoDomainData(nameof(GetExceptions))]
        public void FindProduct_ThrowException_WhenExceptionOtherThanNotFoundReturnedFromCore(Exception exception, FindProduct.Request request)
        {
            // Arrange
            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ThrowsAsync(exception);

            var sut = GetHandler();

            // Act
            var response = sut.Handle(request, default).ConfigureAwait(false).GetAwaiter().GetResult();

            // Assert
            response.Should().BeNull();
        }

        private FindProduct.Handler GetHandler() => new FindProduct.Handler(_mapper, _httpClient.Object, _logger);

        public static List<object[]> GetExceptions =>
            new List<object[]>
            {
                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
                new object[]{new Exception("test")},
            };
    }
}