//using AutoMapper;
//using DigitalCommercePlatform.UIService.Product.Actions.Product;
//using DigitalCommercePlatform.UIService.Product.Automapper;
//using DigitalCommercePlatform.UIService.Product.Dto.Product;
//using DigitalCommercePlatform.UIService.Product.Dto.Stock;
//using DigitalCommercePlatform.UIService.Product.Models.Find;
//using DigitalCommercePlatform.UIService.Product.Models.Product;
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

//namespace DigitalCommercePlatform.UIService.Product.Tests.Actions
//{
//    public class FindProductTests
//    {
//        private readonly FakeLogger<FindProduct.Handler> _logger;
//        private readonly IMapper _mapper;
//        private readonly Mock<IMiddleTierHttpClient> _httpClient;
//        private readonly Mock<IOptions<AppSettings>> _options;

//        public FindProductTests()
//        {
//            _logger = new FakeLogger<FindProduct.Handler>();
//            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));
//            _httpClient = new Mock<IMiddleTierHttpClient>();
//            _options = new Mock<IOptions<AppSettings>>();
//            var settings = new AppSettings();
//            settings.Configure(new Dictionary<string, string> { { "Core.Product.Url", "http://core" }, { "Core.Stock.Url", "http://stock" } });
//            _options.Setup(x => x.Value).Returns(settings);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task FindProduct_RequestWithPagination_CallCoreForDataAndCount(IEnumerable<ProductDto> productDtos)
//        {
//            //arrange
//            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = true };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);
//            _httpClient.Setup(x => x.GetAsync<long>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(1);

//            var expected = _mapper.Map<IEnumerable<ProductModel>>(productDtos);

//            var sut = GetHandler();
//            //act
//            var result = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

//            //assert
//            _httpClient.Verify(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("details=true", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.StartsWith("http://core/find?", StringComparison.InvariantCultureIgnoreCase)),
//                                                                        It.IsAny<IEnumerable<object>>(),
//                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

//            _httpClient.Verify(x => x.GetAsync<long>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.StartsWith("http://core/count?", StringComparison.InvariantCultureIgnoreCase)),
//                                                                        It.IsAny<IEnumerable<object>>(),
//                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

//            result.TotalRecords.Should().Be(1);
//            result.ReturnObject.Should().BeEquivalentTo(expected);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task FindProduct_RequestWithoutPagination_CallCoreOnlyForData(IEnumerable<ProductDto> productDtos)
//        {
//            //arrange
//            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);

//            var expected = _mapper.Map<IEnumerable<ProductModel>>(productDtos);

//            var sut = GetHandler();
//            //act
//            var result = await sut.Handle(request, new CancellationToken()).ConfigureAwait(false);

//            //assert
//            _httpClient.Verify(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.Contains("MaterialNumber=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("page=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("pagesize=1", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.Contains("details=true", StringComparison.InvariantCultureIgnoreCase)
//                                                                                         && x.StartsWith("http://core/find?", StringComparison.InvariantCultureIgnoreCase)),
//                                                                        It.IsAny<IEnumerable<object>>(),
//                                                                        It.IsAny<IDictionary<string, object>>()), Times.Once);

//            _httpClient.Verify(x => x.GetAsync<long>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Never);

//            result.TotalRecords.Should().BeNull();
//            result.ReturnObject.Should().BeEquivalentTo(expected);
//        }

//        [Theory]
//        [AutoDomainData(nameof(GetExceptions))]
//        public void FindProduct_ThrowsException_WhenStockCoreThrowsExceptionOtherThanNotFound(Exception exception, IEnumerable<ProductDto> productDtos)
//        {
//            //arrange
//            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);

//            _httpClient.Setup(x => x.GetAsync<List<StockDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>())).Throws(exception);

//            var sut = GetHandler();
//            //act and assert
//            Assert.ThrowsAsync<Exception>(async () => await sut.Handle(request, new CancellationToken()).ConfigureAwait(false));
//            Assert.Contains(_logger.GetMessages(), l => l.Contains($"Error getting stock data for ids: "));
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task FindProduct_ReturnsEmptyStockDataWhenStockCoreThrowsNotFoundException(IEnumerable<ProductDto> productDtos)
//        {
//            //arrange
//            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ReturnsAsync(productDtos);

//            _httpClient.Setup(x => x.GetAsync<List<StockDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>())).Throws(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

//            var sut = GetHandler();

//            //act
//            var result = await sut.Handle(request, default).ConfigureAwait(false);

//            //act and assert
//            result.ReturnObject.Should().HaveCount(productDtos.Count());
//            result.ReturnObject.Any(x => x.Plants.Any(p => p.Stock != null)).Should().BeFalse();
//        }

//        [Fact]
//        public async Task FindProduct_ReturnsNull_WhenNotFoundReturnedFromCore()
//        {
//            //arrange
//            var request = new FindProduct.Request { Page = 1, PageSize = 10, Query = new FindProductModel { MaterialNumber = new string[] { "1" } }, WithPaginationInfo = false };

//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ThrowsAsync(RemoteServerHttpException.WithMessageDetailsAndStatusCode("test", System.Net.HttpStatusCode.NotFound, null));

//            var sut = GetHandler();

//            //act
//            var result = await sut.Handle(request, default);

//            //act and assert
//            result.Should().BeNull();
//        }

//        [Theory]
//        [AutoDomainData(nameof(GetExceptions))]
//        public void FindProduct_ThrowException_WhenExceptionOtherThanNotFoundReturnedFromCore(Exception exception, FindProduct.Request request)
//        {
//            //arrange
//            _httpClient.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
//                        .ThrowsAsync(exception);

//            var sut = GetHandler();

//            //act
//            Func<Task> act = async () => { await sut.Handle(request, default); };

//            //act and assert
//            act.Should().Throw<Exception>();
//            _logger.GetMessages().Any(x => x.Contains("Error getting product data in")).Should().BeTrue();
//        }

//        [Fact]
//        public void Validator_ValidatFalse_WhenNotValidRequest()
//        {
//            //arrange
//            var sut = new FindProduct.Validator();

//            //act
//            var result = sut.TestValidate(new FindProduct.Request { Page = -1, PageSize = -1, Query = null });

//            //assert
//            result.ShouldHaveValidationErrorFor(x => x.Page);
//            result.ShouldHaveValidationErrorFor(x => x.PageSize);
//            result.ShouldHaveValidationErrorFor(x => x.Query);
//        }

//        [Fact]
//        public void Validator_ValidatTrue_WhenValidRequest()
//        {
//            //arrange
//            var sut = new FindProduct.Validator();

//            //act
//            var result = sut.TestValidate(new FindProduct.Request { Page = 1, PageSize = 1, Query = new FindProductModel() });

//            //assert
//            result.ShouldNotHaveValidationErrorFor(x => x.Page);
//            result.ShouldNotHaveValidationErrorFor(x => x.PageSize);
//            result.ShouldNotHaveValidationErrorFor(x => x.Query);
//        }

//        private FindProduct.Handler GetHandler() => new FindProduct.Handler(_mapper, _httpClient.Object, _logger, _options.Object);

//        public static List<object[]> GetExceptions =>
//            new List<object[]>
//            {
//                new object[]{RemoteServerHttpException.WithMessageDetailsAndStatusCode("test",System.Net.HttpStatusCode.BadGateway, null)},
//                new object[]{new Exception("test")},
//            };
//    }
//}