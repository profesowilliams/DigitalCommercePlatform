//using AutoMapper;
//using DigitalFoundation.AppServices.Product.Actions.Product;
//using DigitalFoundation.AppServices.Product.Automapper;
//using DigitalFoundation.AppServices.Product.Dto.Find;
//using DigitalFoundation.AppServices.Product.Dto.GetProduct;
//using DigitalFoundation.AppServices.Product.Dto.GetProductMultiple;
//using DigitalFoundation.AppServices.Product.Exceptions;
//using DigitalFoundation.AppServices.Product.HttpClients;
//using DigitalFoundation.AppServices.Product.Model;
//using DigitalFoundation.AppServices.Product.Services;
//using DigitalFoundation.Common.MongoDb.Models;
//using DigitalFoundation.Common.TestUtilities;
//using FluentAssertions;
//using Microsoft.Extensions.Logging;
//using Moq;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Xunit;

//namespace DigitalFoundation.AppServices.Product.Tests.Services
//{
//    public class ProductServiceTests
//    {
//        #region GetAsync

//        [Fact]
//        public void GetAsync_ValidCatalog_ValidResponse()
//        {
//            // arrange
//            var id = "1";
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfile(new ProductProfile()));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            productClient
//                .Setup(x => x.GetAsync(It.IsAny<GetProductDetailCriteriaDto>()))
//                .ReturnsAsync(new CoreProductModel { Source = new Source() { ID = id } });

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductDetailCriteriaDto { Id = id };

//            // act
//            _ = service.GetAsync(query).Result;

//            //asert
//            stockClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Once);
//        }

//        [Fact]
//        public void GetAsync_InvalidCatalog_ThrowsException()
//        {
//            // arrange
//            var id = "1";
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapper = Mock.Of<IMapper>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductDetailCriteriaDto { Id = id };

//            // act - assert
//            Assert.ThrowsAsync<InvalidCatalogException>(() => { return service.GetAsync(query); });
//        }

//        [Fact]
//        public void GetAsync_ProductNotFound_ThrowsException()
//        {
//            // arrange
//            var id = "1";
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapper = Mock.Of<IMapper>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductDetailCriteriaDto { Id = id };

//            // act - assert
//            Assert.ThrowsAsync<ProductNotFoundException>(() => { return service.GetAsync(query); });
//        }

//        #endregion GetAsync

//        #region GetMultiple

//        [Fact]
//        public void GetMultipleAsync_InvalidCatalog_ThrowsException()
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapper = Mock.Of<IMapper>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { }; // todo

//            // act - assert
//            Assert.ThrowsAsync<InvalidCatalogException>(() => { return service.GetMultipleAsync(query, true, true, true); });
//        }

//        [Fact]
//        public void GetMultipleAsync_ProductNotFound_ThrowsException()
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapper = Mock.Of<IMapper>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { }; // todo

//            // act - assert
//            Assert.ThrowsAsync<ProductNotFoundException>(() => { return service.GetMultipleAsync(query, true, true, true); });
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetMultipleAsync_CallsStock_WhenStockIncluded(List<Dto.ProductDetailDto> products)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetMultipleAsync(It.IsAny<GetProductMultipleCriteriaDto>())).ReturnsAsync(products);

//            var stockClient = new Mock<IStockClient>();
//            var stockModelDictionary = new Dictionary<string, StockModel>()
//            {
//                { "1", new StockModel() }
//            };
//            stockClient.Setup(x => x.GetMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(stockModelDictionary);
//            var priceClient = new Mock<IPriceClient>();
//            var priceModelDictionary = new Dictionary<string, PriceModel>()
//            {
//                { "1", new PriceModel() }
//            };
//            priceClient.Setup(x => x.GetMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(priceModelDictionary);

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { };

//            // act
//            _ = await service.GetMultipleAsync(query, true, false, false);

//            //assert
//            stockClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Once);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetMultipleAsync_DontCallsStock_WhenStockNotIncluded(List<Dto.ProductDetailDto> products)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetMultipleAsync(It.IsAny<GetProductMultipleCriteriaDto>())).ReturnsAsync(products);

//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { };

//            // act
//            _ = await service.GetMultipleAsync(query, false, false, true);

//            //assert
//            stockClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Never);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetMultipleAsync_CallsPrice_WhenPriceIncluded(List<Dto.ProductDetailDto> products)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetMultipleAsync(It.IsAny<GetProductMultipleCriteriaDto>())).ReturnsAsync(products);

//            var stockClient = new Mock<IStockClient>();
//            var stockModelDictionary = new Dictionary<string, StockModel>()
//            {
//                { "1", new StockModel() }
//            };
//            stockClient.Setup(x => x.GetMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(stockModelDictionary);
//            var priceClient = new Mock<IPriceClient>();
//            var priceModelDictionary = new Dictionary<string, PriceModel>()
//            {
//                { "1", new PriceModel() }
//            };
//            priceClient.Setup(x => x.GetMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(priceModelDictionary);

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { };

//            // act
//            _ = await service.GetMultipleAsync(query, false, true, false);

//            //assert
//            priceClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Once);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetMultipleAsync_DontCallsPrice_WhenPriceIsNotIncluded(List<Dto.ProductDetailDto> products)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetMultipleAsync(It.IsAny<GetProductMultipleCriteriaDto>())).ReturnsAsync(products);

//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { };

//            // act
//            _ = await service.GetMultipleAsync(query, false, false, false);

//            //assert
//            priceClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Never);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetMultipleAsync_ReturnAccesories_WhenAccesoryIncluded(List<Dto.ProductDetailDto> products)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetMultipleAsync(It.IsAny<GetProductMultipleCriteriaDto>())).ReturnsAsync(products);

//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { };

//            // act
//            var response = await service.GetMultipleAsync(query, false, false, true);

//            //assert
//            response.All(x => x.Accessories.Count > 0).Should().BeTrue();
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetMultipleAsync_ReturnAnyAccesories_WhenAccesoryIsNotIncluded(List<Dto.ProductDetailDto> products)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetMultipleAsync(It.IsAny<GetProductMultipleCriteriaDto>())).ReturnsAsync(products);

//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);
//            var query = new GetProductMultipleCriteriaDto { };

//            // act
//            var response = await service.GetMultipleAsync(query, false, false, false);

//            //assert
//            response.All(x => x.Accessories == null).Should().BeTrue();
//        }

//        #endregion GetMultiple

//        #region GetSummaryAsync

//        [Fact]
//        public void GetSummaryAsync_ValidCatalog_ValidResponse()
//        {
//            // arrange
//            var id = "1";
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            productClient
//                .Setup(x => x.GetSummaryAsync(It.IsAny<string>()))
//                .ReturnsAsync(new CoreProductSummaryModel {Source = new Source() { ID = id } });
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act
//            var response = service.GetSummaryAsync(id).Result;

//            // assert
//            Assert.NotNull(response);
//        }

//        [Fact]
//        public void GetSummaryAsync_InvalidCatalog_ThrowsException()
//        {
//            // arrange
//            var id = "1";
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapper = Mock.Of<IMapper>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act - asset
//            Assert.ThrowsAsync<InvalidCatalogException>(() => { return service.GetSummaryAsync(id); });
//        }

//        [Fact]
//        public void GetSummaryAsync_ProductNotFound_ThrowsException()
//        {
//            // arrange
//            var id = "1";
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapper = Mock.Of<IMapper>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act - asset
//            Assert.ThrowsAsync<ProductNotFoundException>(() => { return service.GetSummaryAsync(id); });
//        }

//        #endregion GetSummaryAsync

//        #region GetSummaryMultipleAsync

//        [Fact]
//        public void GetSummaryMultipleAsync_ValidCatalog_ValidResponse()
//        {
//            // arrange
//            var id = "1";
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            productClient
//                .Setup(x => x.GetSummaryMultipleAsync(It.IsAny<string[]>()))
//                .ReturnsAsync(new Dictionary<string, CoreProductSummaryModel> { { id, new CoreProductSummaryModel { Source = new Source { ID = id } } } });
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act
//            var response = service.GetSummaryMultipleAsync(new string[] { id }, 1, 25, true).Result;

//            // assert
//            Assert.NotNull(response);
//        }

//        [Fact]
//        public void GetSummaryMultipleAsync_InvalidCatalog_ThrowsException()
//        {
//            // arrange
//            var id = "1";
//            var mapper = Mock.Of<IMapper>();
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act - assert
//            Assert.ThrowsAsync<InvalidCatalogException>(() => { return service.GetSummaryMultipleAsync(new string[] { id }, 1, 25, true); });
//        }

//        [Fact]
//        public void GetSummaryMultipleAsync_ProductNotFound_ThrowsException()
//        {
//            // arrange
//            var id = "1";
//            var mapper = Mock.Of<IMapper>();
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var productClient = new Mock<IProductClient>();
//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act - assert
//            Assert.ThrowsAsync<ProductNotFoundException>(() => { return service.GetSummaryMultipleAsync(new string[] { id }, 1, 25, true); });
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetSummaryMultipleAsync_DontCallsPrice_WhenPriceIsNotIncluded(Dictionary<string, CoreProductSummaryModel> summary)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetSummaryMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(summary);

//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act
//            _ = await service.GetSummaryMultipleAsync(new string[] { "1" }, 1, 1, false);

//            //assert
//            priceClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Never);
//        }

//        [Theory]
//        [AutoDomainData]
//        public async Task GetSummaryMultipleAsync_CallsPrice_WhenPriceIncluded(Dictionary<string, CoreProductSummaryModel> summary)
//        {
//            // arrange
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var productClient = new Mock<IProductClient>();
//            productClient.Setup(x => x.GetSummaryMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(summary);

//            var stockClient = new Mock<IStockClient>();
//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act
//            _ = await service.GetSummaryMultipleAsync(new string[] { "1" }, 1, 1, true);

//            //assert
//            priceClient.Verify(x => x.GetMultipleAsync(It.IsAny<string[]>()), Times.Once);
//        }

//        #endregion GetSummaryMultipleAsync

//        #region Find

//        [Fact]
//        public void Find_ValidResponse()
//        {
//            // arrange
//            var mapperConfiguration = new MapperConfiguration(m => m.AddProfiles(new Profile[] { new ProductProfile(), new PriceProfile(), new ProductSummaryProfile(), new StockProfile() }));
//            var mapper = new Mapper(mapperConfiguration);
//            var logger = Mock.Of<ILogger<ProductService>>();
//            var query = new Mock<CriteriaDto>();

//            var productClient = new Mock<IProductClient>();
//            var findProductDto = new List<FindProductDto>();
//            findProductDto.Add(new FindProductDto { MaterialNumber = "test" });
//            var productResponse = new Mock<FindProduct.FindProductResponse>(findProductDto);
//            productClient.Setup(x => x.Find(query.Object)).Returns(Task.FromResult(productResponse.Object));

//            var stockClient = new Mock<IStockClient>();
//            var stockModelDictionary = new Dictionary<string, StockModel>()
//            {
//                { "1", new StockModel() }
//            };
//            stockClient.Setup(x => x.GetMultipleAsync(It.IsAny<string[]>())).ReturnsAsync(stockModelDictionary);

//            var priceClient = new Mock<IPriceClient>();

//            var service = new ProductService(logger, mapper, productClient.Object, stockClient.Object, priceClient.Object);

//            // act
//            var response = service.Find(query.Object).Result;

//            // assert
//            Assert.NotNull(response);
//        }

//        #endregion Find
//    }
//}