using AutoMapper;
using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Automapper;
using DigitalCommercePlatform.UIService.Product.Dto.Product;
using DigitalCommercePlatform.UIService.Product.Dto.Stock;
using DigitalCommercePlatform.UIService.Product.Models.Product;
using DigitalCommercePlatform.UIService.Product.Tests.Helpers;
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
using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductDetailMultiple;

namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
{
    public class GetProductDetailMultipleTests
    {
        private readonly FakeLogger<GetProductDetailMultiple> _logger;
        private readonly IMapper _mapper;
        private readonly Mock<IMiddleTierHttpClient> _httpClient;
        private readonly Mock<IOptions<AppSettings>> _options;

        public GetProductDetailMultipleTests()
        {
            _logger = new FakeLogger<GetProductDetailMultiple>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));
            _httpClient = new Mock<IMiddleTierHttpClient>();
            _options = new Mock<IOptions<AppSettings>>();
            var settings = new AppSettings();
            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" }, { "Core.Stock.Url", "http://stock" } });
            _options.Setup(x => x.Value).Returns(settings);
        }

        [Fact]
        public void GetProductDetailMultiple_Request_ValidResponse()
        {
            // Arrange
            var ids = new string[] { "1", "2" };

            var request = new Request() { Id = ids.ToList() };

            var response = new GetProductDetailMultipleResponse(
                new List<ProductModel>
                {
                     new ProductModel { ShortDescription = "test"}
                }
            );

            var mapper = new Mapper(new MapperConfiguration(m => m.AddProfile(new ProductProfile())));

            _httpClient.SetupResponse(response, It.IsAny<string>());
            _httpClient.SetupResponse(new List<string>() { "1" }, It.IsAny<string>());

            var options = new Mock<IOptions<AppSettings>>();
            options.Setup(x => x.Value).Returns(new TestAppSettings().Value);

            // Act
            var handler = new Handler(mapper, _httpClient.Object, _logger, options.Object);
            var result = handler.Handle(request, new CancellationToken()).Result;

            // Assert
            _httpClient.Verify(x => x.GetAsync<GetProductDetailMultipleResponse>(It.Is<string>(x => x.Contains("?id=1&id=2&details=False", StringComparison.InvariantCultureIgnoreCase)),
                                                        It.IsAny<IEnumerable<object>>(),
                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

            result.Should().NotBeNull();
            response.ReturnObject.First().ShortDescription.Should().Be(result.ReturnObject.First().ShortDescription);
        }

        [Theory]
        [AutoDomainData(nameof(GetExceptions))]
        public async Task GetProductDetailMultiple_ThrowsException_WhenStockCoreOtherThanNotFoundAsync(Exception exception, Request request, IEnumerable<ProductDto> productDtos)
        {
            // Arrange
            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                        .ReturnsAsync(productDtos);

            _httpClient.Setup(x => x.GetAsync<List<StockDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>())).Throws(exception);

            var handler = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

            // Act
            var result = await handler.Handle(request, new CancellationToken()).ConfigureAwait(false);

            // Assert
            result.Should().BeNull();
        }

        public static List<object[]> GetExceptions =>
            new List<object[]>
            {
                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
                new object[]{new Exception("test")},
            };
    }
}