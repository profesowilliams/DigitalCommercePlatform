//using AutoMapper;
//using DigitalCommercePlatform.UIService.Product.Actions.Product;
//using DigitalCommercePlatform.UIService.Product.Automapper;
//using DigitalCommercePlatform.UIService.Product.Dto.Product;
//using DigitalCommercePlatform.UIService.Product.Dto.Stock;
//using DigitalCommercePlatform.UIService.Product.Tests.Helpers;
//using DigitalFoundation.Common.Client;
//using DigitalFoundation.Common.Settings;
//using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
//using DigitalFoundation.Common.TestUtilities;
//using FluentAssertions;
//using FluentValidation.TestHelper;
//using Microsoft.Extensions.Options;
//using Moq;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading;
//using System.Threading.Tasks;
//using Xunit;
//using static DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductDetailMultiple;

//namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
//{
//    public class GetProductDetailMultipleTests
//    {
//        private readonly FakeLogger<GetProductDetailMultiple> _logger;
//        private readonly IMapper _mapper;
//        private readonly Mock<IMiddleTierHttpClient> _httpClient;
//        private readonly Mock<IOptions<AppSettings>> _options;

//        public GetProductDetailMultipleTests()
//        {
//            _logger = new FakeLogger<GetProductDetailMultiple>();
//            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));
//            _httpClient = new Mock<IMiddleTierHttpClient>();
//            _options = new Mock<IOptions<AppSettings>>();
//            var settings = new AppSettings();
//            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" }, { "Core.Stock.Url", "http://stock" } });
//            _options.Setup(x => x.Value).Returns(settings);
//        }

//        [Fact]
//        public void GetProductDetailMultiple_Request_ValidResponse()
//        {
//            // arrange
//            var ids = new string[] { "1", "2" };

//            var request = new Request() { Id = ids.ToList() };

//            var response = new List<ProductDto>
//            {
//                 new ProductDto { ShortDescription = "test"}
//            };

//            var mapper = new Mapper(new MapperConfiguration(m => m.AddProfile(new ProductProfile())));

//            _httpClient.SetupResponse<IEnumerable<ProductDto>>(response, It.IsAny<string>());
//            _httpClient.SetupResponse(new List<string>() { "1" }, It.IsAny<string>());

//            var options = new Mock<IOptions<AppSettings>>();
//            options.Setup(x => x.Value).Returns(new TestAppSettings().Value);

//            // act
//            var handler = new Handler(mapper, _httpClient.Object, _logger, options.Object);
//            var result = handler.Handle(request, new CancellationToken()).Result;

//            // assert
//            _httpClient.Verify(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.Contains("?id=1&id=2&details=True", StringComparison.InvariantCultureIgnoreCase)),
//                                                            It.IsAny<IEnumerable<object>>(),
//                                                            It.IsAny<IDictionary<string, object>>()), Times.Once);

//            _httpClient.Verify(x => x.GetAsync<List<StockDto>>(It.Is<string>(x => x.Contains("?id=1&id=2&details=True", StringComparison.InvariantCultureIgnoreCase)),
//                                                            It.IsAny<IEnumerable<object>>(),
//                                                            It.IsAny<IDictionary<string, object>>()), Times.Once);

//            result.Should().NotBeNull();
//            response.First().ShortDescription.Should().Be(result.ReturnObject.First().ShortDescription);
//        }

//        [Theory]
//        [AutoDomainData(nameof(GetExceptions))]
//        public void GetProductDetailMultiple_ThrowsException_WhenStockCoreOtherThanNotFound(Exception exception, Request request, IEnumerable<ProductDto> productDtos)
//        {
//            //arrange
//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);

//            _httpClient.Setup(x => x.GetAsync<List<StockDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>())).Throws(exception);

//            var handler = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);
//            //act and assert
//            Assert.ThrowsAsync<Exception>(async () => await handler.Handle(request, new CancellationToken()).ConfigureAwait(false));
//            Assert.Contains(_logger.GetMessages(), l => l.Contains($"Error getting stock data for ids: "));
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetProductDetailMultiple_ReturnsEmptyStockDataWhenStockCoreThrowsNotFoundException(IEnumerable<ProductDto> productDtos)
//        {
//            //arrange
//            var request = new GetProductDetailMultiple.Request { Id = new List<string> { } };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);

//            _httpClient.Setup(x => x.GetAsync<List<StockDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>())).Throws(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

//            var sut = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

//            //act
//            var result = await sut.Handle(request, default).ConfigureAwait(false);

//            //act and assert
//            result.ReturnObject.Should().HaveCount(productDtos.Count());
//            result.ReturnObject.Any(x => x.Plants.Any(p => p.Stock != null)).Should().BeFalse();
//        }

//        [Fact]
//        public async Task GetProductDetailMultiple_ReturnsNull_WhenNotFoundReturnedFromCore()
//        {
//            //arrange
//            var request = new Request { Id = new List<string> { } };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ThrowsAsync(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

//            var sut = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

//            //act
//            var result = await sut.Handle(request, default);

//            //act and assert
//            result.Should().BeNull();
//        }

//        [Theory]
//        [AutoDomainData(nameof(GetExceptions))]
//        public void GetProductDetailMultiple_ThrowException_WhenExceptionOtherThanNotFoundReturnedFromCore(Exception exception, Request request)
//        {
//            //arrange
//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ThrowsAsync(exception);

//            var sut = new Handler(_mapper, _httpClient.Object, _logger, _options.Object);

//            //act
//            Func<Task> act = async () => { await sut.Handle(request, default); };

//            //act and assert
//            act.Should().Throw<Exception>();
//            _logger.GetMessages().Any(x => x.Contains("Error getting product data in")).Should().BeTrue();
//        }

//        [Fact]
//        public void GetProductDetailMultipleValidator_EmptyId_InvalidRequest()
//        {
//            var request = new Request() { Id = new List<string>() };
//           // var result = new Validator().TestValidate(request);
//            result.ShouldHaveValidationErrorFor(r => r.Id);
//        }

//        [Fact]
//        public void GetProductDetailMultipleValidator_ValidId_ValidRequest()
//        {
//            var request = new Request() { Id = new List<string>() { "1" } };
//            //var result = new Validator().TestValidate(request);
//            result.ShouldNotHaveAnyValidationErrors();
//        }

//        public static List<object[]> GetExceptions =>
//            new List<object[]>
//            {
//                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
//                new object[]{new Exception("test")},
//            };
//    }
//}