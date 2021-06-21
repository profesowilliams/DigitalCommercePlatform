using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class CacheServiceTest
    {
        private readonly ICachingService _cachingService;
        private readonly Mock<ILogger<CachingService>> _cachelogger;
        private readonly IMemoryCache _memoryCache;

        public CacheServiceTest()
        {
            _cachelogger = new Mock<ILogger<CachingService>>();
            _memoryCache = new MemoryCache(new MemoryCacheOptions());
            _cachingService = new CachingService(_memoryCache, _cachelogger.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogFromCache()
        {
            // Act
            var result = await _cachingService.GetCatalogFromCache("cache");
            // Assert
            Assert.Null(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetFeatureFromCache()
        {
            // Act
            var result = await _cachingService.GetFeatureFromCache("cache","key");
            // Assert
            Assert.NotNull(result);
        }

        [Theory]
        [AutoDomainData]
        public async Task ClearFromCache()
        {
            // Act
            var result = await _cachingService.ClearFromCache("cache");
            // Assert
            result.Should().BeTrue();
        }

        [Theory]
        [AutoDomainData]
        public async Task SetCatalogCache()
        {
            List<CatalogResponse> catalog = new List<CatalogResponse>();
            // Act
            var result = await _cachingService.SetCatalogCache(catalog, "key");
            // Assert
            result.Should().BeTrue();
        }
    }
}