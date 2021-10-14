//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Models;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class BrowseServiceTests
    {
        private readonly ICachingService _cachingService;
        private readonly IBrowseService _browseService;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<BrowseService>> _logger;
        private readonly Mock<ILogger<CachingService>> _cachelogger;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly IMemoryCache _memoryCache;

        public BrowseServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<BrowseService>>();
            _cachelogger = new Mock<ILogger<CachingService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("Catalog.App.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-catalog/v1");
            _appSettings.Setup(s => s.GetSetting("Feature.DF.ProuctCatalog")).Returns("false");
            _appSettings.Setup(s => s.GetSetting("Browse.UI.External.Catalog.Url")).Returns("https://mtapnew.stage.svc.us.cstenet.com/ProductService/api/VendorProduct/getProductCatalog");
            _uiContext = new Mock<IUIContext>();
            _uiContext.SetupGet(x => x.User).Returns(new User { ActiveCustomer = new Customer { CustomerNumber = "123", System = "2" }, Customers = new List<string>() });
            _mapper = new Mock<IMapper>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _cachingService = new CachingService(_memoryCache, _cachelogger.Object);
            _browseService = new BrowseService(_middleTierHttpClient.Object, _cachingService, _appSettings.Object, _mapper.Object, _logger.Object);
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

        [Theory]
        [AutoDomainData]
        public async Task GetProductCatalog(ProductCatalog productCatalog)
        {
            // Arrange
            productCatalog = new ProductCatalog
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
    }
}