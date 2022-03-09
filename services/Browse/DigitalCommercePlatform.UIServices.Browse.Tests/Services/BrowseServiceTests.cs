//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetStock;
using DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Dto.Stock;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalCommercePlatform.UIServices.Browse.Models.Stock;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Cache;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class BrowseServiceTests
    {
        private readonly Mock<ICacheProvider> _cacheProvider;
        private readonly IBrowseService _browseService;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<BrowseService>> _logger;
        private readonly Mock<IUIContext> _uiContext;
        private readonly IMapper _mapper;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly IMemoryCache _memoryCache;

        public BrowseServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<BrowseService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("Product.App.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1");
            _appSettings.Setup(s => s.GetSetting("Catalog.App.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1");
            _appSettings.Setup(s => s.GetSetting("Stock.App.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-stock/v1");
            _appSettings.Setup(s => s.GetSetting("Feature.DF.ProuctCatalog")).Returns("false");
            _appSettings.Setup(s => s.GetSetting("Browse.UI.External.Catalog.Url")).Returns("https://mtapnew.stage.svc.us.cstenet.com/ProductService/api/VendorProduct/getProductCatalog");
            _uiContext = new Mock<IUIContext>();
            _uiContext.SetupGet(x => x.User).Returns(new User { ActiveCustomer = new Customer { CustomerNumber = "123", System = "2" }, Customers = new List<string>() });                       
            _memoryCache = new MemoryCache(new MemoryCacheOptions());           
            _mapper = new Mapper(new MapperConfiguration(cfg => 
            {
                cfg.AddProfile(new CatalogProfile());
                cfg.AddProfile(new StockProfile());
            }));
            _cacheProvider = new();
            _browseService = new BrowseService(_middleTierHttpClient.Object, _cacheProvider.Object, _appSettings.Object, _mapper, _logger.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductDetails(FindProductHandler.Request request)
        {
            // Act
            var result = await _browseService.FindProductDetails(request);
            // Assert
            Assert.Null(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(GetProductDetailsHandler.Request request)
        {
            // Act
            var result = await _browseService.GetProductDetails(request);
            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetProductCatalog()
        {
            // Arrange
            var productCatalog = new ProductCatalogRequest
            {
                CorporateCode = "0100",
                CultureName = "",
                Id = "ALT",
                Level = 3,
                ShortenSubcategories = true
            };

            GetProductCatalogHandler.Request request = new GetProductCatalogHandler.Request(productCatalog);
            // Act
            var result = await _browseService.GetProductCatalogDetails(request);
            // Assert
            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogUsingDF_WithResults(ProductCatalogRequest request, CatalogDto response)
        {
            // Arrange
            _middleTierHttpClient.Setup(e =>
                  e.GetAsync<CatalogDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), It.IsAny<IDictionary<string, string>>()))
             .ReturnsAsync(response);

            //Act
            var result = await _browseService.GetCatalogUsingDF(request);

            // Assert
            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public void GetCatalogUsingDF_WithException(ProductCatalogRequest request)
        {
            // Arrange
            _middleTierHttpClient.Setup(e =>
                  e.GetAsync<CatalogDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), It.IsAny<IDictionary<string, string>>()))
             .ThrowsAsync(new RemoteServerHttpException());

            //Act
            Func<Task> act = () => _browseService.GetCatalogUsingDF(request);

            // Assert
            act.Should().ThrowAsync<Exception>();
        }
        
        [Theory]
        [AutoDomainData]
        public async Task GetProductVariant_CallsApiOnce(GetProductVariantHandler.Request request, ProductVariantDto expected)
        {
            // Arrange
            var url = $"https://eastus-dit-service.dc.tdebusiness.cloud/app-product/v1/ProductVariants?id={request.Id}";
            _middleTierHttpClient.Setup(c =>
                    c.GetAsync<ProductVariantDto>(It.Is<string>(u => u == url), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), It.IsAny<IDictionary<string, string>>()))
                .ReturnsAsync(expected)
                .Verifiable();

            //Act
            var result = await _browseService.GetProductVariant(request);

            // Assert
            _middleTierHttpClient.Verify();
            result.Should().BeEquivalentTo(expected);
        }


        [Theory]
        [AutoDomainData]
        public async Task GetStock_CallsApiOnce(GetStockHandler.Request request, IEnumerable<StockDto> expected)
        {
            // Arrange
            var url = $"https://eastus-dit-service.dc.tdebusiness.cloud/app-stock/v1?id={request.Id}";
            _middleTierHttpClient.Setup(c =>
                    c.GetAsync<IEnumerable<StockDto>>(It.Is<string>(u => u == url), null, null, null))
                .ReturnsAsync(expected)
                .Verifiable();

            //Act
            var result = await _browseService.GetStock(request);

            // Assert
            _middleTierHttpClient.Verify();
            result.Should().BeEquivalentTo(expected.First());
        }
    }
}